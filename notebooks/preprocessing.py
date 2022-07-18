import numpy as np
import pandas as pd
import re


def get_numbers(text):
    """Takes the text from the raw output file 
    and extracts the number contained in it

    Args:
        text (string): raw text of the file

    Raises:
        ValueError: _description_

    Returns:
        int: actual data value
    """

    # There seem to be two formats for the files
    # This converts the not comma file into a row wise comma file
    if not all(valid in text[0].lower() for valid in ['h=',"spo="]):
        text = [t.strip() for t in text]
        if "spo" in text[0]: text = text[1:]
        heartrates = text[::2]
        spos = text[1:-1:2]
        text = list(zip(heartrates,spos))
        text = [",".join(t+("\n",)) for t in text]

    # Filter rows and throw away rows that contain errors
    # [print(len(re.findall('[0-9]+', t))) for t in text]
    text = [t for t in text if all(valid in t.lower() for valid in ['h=', ',',"spo="]) and len(re.findall('[0-9]+', t)) == 2]
    
    # Concat the text to one string
    text = "".join(text).strip().replace('\n',',')
    values = text.split(',')
    
    spo = []
    heartrate = []
    
    # Iterate over ever entry and filter out the value
    for i,v in enumerate(values):
        try:
            if '=' in v:
                name = v.split('=')[0].strip()
                val = v.split('=')[1].strip()
                
                # If SPO is first values then there are more spo values than HeartRate
                if i == 0 and 'spo' in name.lower(): continue
                
                val = int(val)
                
                if 'spo' == name.lower():
                    if name != "spo": print(name)
                    spo.append(val)
                elif 'h' == name.lower():
                    if name != "H": print(name)
                    heartrate.append(val)

                
        except:
            print(f"Error in reading row: {i}, name: {name}, val: {val} text: {v}")
            raise ValueError()
    if len(heartrate) != len(spo):
        f"Number of Samples varies, HeartRate: {len(heartrate)} , SPO: {len(spo)}"
        raise ValueError
    return pd.DataFrame(data=zip(heartrate,spo),columns=["HeartRate","SPO_Values"])

def hampel_filter_forloop(input_series, window_size, threshold=3):
    """Copied from https://towardsdatascience.com/outlier-detection-with-hampel-filter-85ddf523c73d

    Args:
        input_series (Series): Data to clean
        window_size (_type_): size of the sliding windows
        n_sigmas (int, optional): How strict ot filter. Defaults to 3.

    Returns:
        _type_: _description_
    """
    n = len(input_series)
    new_series = input_series.copy()
    k = 1.4826 # scale factor for Gaussian distribution
    
    indices = []
    
    # possibly use np.nanmedian 
    for i in range((window_size),(n - window_size)):
        x0 = np.median(input_series[(i - window_size):(i + window_size)])
        S0 = k * np.median(np.abs(input_series[(i - window_size):(i + window_size)] - x0))
        if (np.abs(input_series[i] - x0) > threshold * S0):
            new_series[i] = x0
            indices.append(i)
    
    return new_series, indices

def outlier_filter(data,threshold=3):
    """Filters the data based on the so called z-score
    (combination of mean and standard deviation)

    Args:
        data (Series): Columns of a Pandas dataframe
        threshold (int): threshold on how strict data is filtered

    Returns:
        (Series) : Boolean Mask for which datapoints are outliers
    """

    mean = np.nanmean(data)
    std = np.nanstd(data)
    z_score = np.abs((data - mean) / std)
    return z_score > threshold

def dataPreProcess(raw_data, filter_threshold = 1):
    """takes the a dataframe of raw values and pre-processes it 

    Args:
        raw_text (list): raw string of the file as a list. Each entry resamples one row
        
    Returns:
        df (dataframe): cleaned and preprocessed data
    """
    # Throw away the Header Text
    raw_data = raw_data[3:]
    df = get_numbers(raw_data)

    # Throw away all repeated data and reindex the timesteps
    df = df[df.shift() != df]
    df.reset_index(drop=True,inplace=True)
    
    # Filter -999 and unrealistic values
    a = np.array(df['HeartRate'].values.tolist())
    df['HeartRate'] = np.where(a >= 40, a, np.nan).tolist()
    a = np.array(df['HeartRate'].values.tolist())
    df['HeartRate'] = np.where(a <= 220, a, np.nan).tolist()
    
    b = np.array(df['SPO_Values'].values.tolist())
    df['SPO_Values'] = np.where(b <= 100, b, np.nan).tolist()
    b = np.array(df['SPO_Values'].values.tolist())
    df['SPO_Values'] = np.where(b >= 88, b, np.nan).tolist()
    
    # Drop rows where there is no SPO or BPM datad
    df.dropna(axis=0, inplace=True, how='all')
    
    # Filter Outliers in the HeartRate data
    a = np.array(df['HeartRate'].values.tolist())
    df['HeartRate'] = np.where(outlier_filter(a,filter_threshold), np.nan, a).tolist()
    filer_mask = outlier_filter(a,filter_threshold)
    # print(f"outliers filter: {filer_mask.sum()} thats {filer_mask.sum()/a.shape[0]*100 :.2f}%")
    # print(f"Values filtered: {a[filer_mask]}")

    # df['HeartRate'], indices = hampel_filter_forloop(a,window_size = 2,threshold = filter_threshold)
    # print(f"outliers filter: {len(indices)}")
    # print(f"Values filtered: {df['HeartRate'].iloc[indices]}")
    
    # Interpolate missing Values
    df["HeartRate"].interpolate(method = 'linear',inplace=True, limit_direction='both')
    df["SPO_Values"].interpolate(method = 'linear',inplace=True, limit_direction='both')
    
    # If the columns starts with NaN values the Interpolation will not be able to fill the values
    # So we fill them with the next possible value
    df["HeartRate"].fillna(method='ffill',inplace=True)
    df["SPO_Values"].fillna(method='ffill',inplace=True)
    
    if df["HeartRate"].isnull().values.all():
        print(f"There are no valid HeartRate values, returning None")
        return None
    if df["SPO_Values"].isnull().values.all():
        print(f"There are no valid SPO values, returning None")
        return None
    
    if df.isnull().values.any():
        print("File still contains NaN values")
        raise ValueError()
    
    return df


if __name__ == "__main__":
    import os
    files = os.listdir("data")
    for file in files:
        print(file)
        raw_data = open(f'data/{file}', "r")
        raw_data = raw_data.readlines()
        print(dataPreProcess(raw_data))