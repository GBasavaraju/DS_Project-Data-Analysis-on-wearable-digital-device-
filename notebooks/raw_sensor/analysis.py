from pathlib import Path

import heartpy as hp
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.signal import resample

import config


def get_number(text):
    try:
        if '=' in text:
            val = text.split('=')[1].strip()
            try:
                val = int(val)
            except ValueError:
                val = np.NaN
        elif text.isnumeric():
            val = int(float(text))
        else:
            val = np.NaN
    except:
        print(text)
        raise ValueError()
    
    return val
            
            
def read_data(filepath):
    df = pd.read_csv(filepath, comment='#', names = ['TIME', 'RED', 'IR'], dtype=str, 
                         keep_default_na=False, on_bad_lines='skip')
    df['TIME'] = df['TIME'].apply(get_number)
    df['RED'] = df['RED'].apply(get_number)
    df['IR'] = df['IR'].apply(get_number)
    if df['TIME'].isnull().values.any():
        df['TIME'] = df['TIME'].interpolate()
    df = df.fillna(method = 'ffill')
    df = df.astype(int)
    return df

def read_all_dfs(folder, label, files):
    dfs = []
    for file in files:
        filepath = Path(folder, label, file)
        df = read_data(filepath)
        dfs.append((label, file, df))
    return dfs

def plot_sensor_values(signal, title, ylabel, logarithmic=False):
    plt.figure(figsize=(12,6))
    plt.plot(signal)
    plt.title(f'Activity: {title}')
    plt.xlabel('Time')
    plt.ylabel(ylabel)
    if logarithmic:
        plt.yscale('symlog')
    plt.show()

def get_beats_per_minute(signal, bpm_every = 0.5):
    segment_width = 120
    segment_overlap = (segment_width - (60 * bpm_every)) / segment_width
    wd, measures = hp.process_segmentwise(signal, config.RESAMPLED_RATE, segment_width=segment_width, 
                            segment_overlap=segment_overlap, high_precision=True, clean_rr=True, replace_outliers=True)
#     _, measures = hp.process(signal, sample_rate = config.RESAMPLED_RATE, 
#                        high_precision=True, clean_rr=True)
    return measures.get('bpm', []), wd, measures

def filter_outliers_signal(df, col):
    q_low = df[col].quantile(0.10)
    q_hi = df[col].quantile(0.90)
#     print('Q Low:', q_low, 'Q High:', q_hi)
#     print('No of outliers:', len(df.loc[(df[col] >= q_hi) | (df[col] <= q_low), col]))
#     print(df.loc[(df[col] >= q_hi) | (df[col] <= q_low), col])
    df.loc[(df[col] >= q_hi) | (df[col] <= q_low), col] = np.NaN
    df[col] = df[col].fillna(method = 'bfill')
    df[col] = df[col].fillna(method = 'ffill')
    return df

def filter_frequencies(signal, fs):
    filtered = hp.filter_signal(signal, config.BANDPASS, sample_rate=fs, 
                            order=3, filtertype='bandpass')
    return filtered

def show_bpm(filtered_signal, fs):
    resample_ratio = config.RESAMPLED_RATE / fs
    resampled = resample(filtered_signal, int(len(filtered_signal) * resample_ratio))
    bpms, wd, measures = get_beats_per_minute(resampled)
    print('BPMS:', bpms)
    return wd, measures
