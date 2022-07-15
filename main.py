from flask import Flask, render_template, request, redirect, url_for
import os
from os.path import join
import pandas as pd
import numpy as np

app = Flask(__name__)

UPLOAD_FOLDER = 'static/files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#DataBase
#:ToDO : Mahima/DB

# Root URL
@app.route('/')
def index():
     # Set upload HTML template '\templates\CSV_Upload.html'
    return render_template('CSV_Upload.html')

# Get the uploaded files, data preprocess, postprocess

@app.route("/", methods=['POST'])

# def hello():
#   return 'hello'

def uploadFiles():
      # get the uploaded file
      uploaded_file = request.files['file']
      if uploaded_file.filename != '':
        # set the file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
        # save the file
        uploaded_file.save(file_path)
        df = dataPreProcessing(file_path)
        dataStats(df)
      return redirect(url_for('index'))


def dataPreProcessing(filepath):
    #ToDO: From @s8dlhoff (Now, just for reference)
    dataset = pd.read_csv(filepath)
    dataset = dataset.tail(-2)
    dataset = dataset.drop(['Custom', 'Custom.1'], axis=1)
    dataset = dataset.rename(columns={"#!": "HeartRate", "Workbook:": "SPO_Values"})
    dataset['HeartRate'] = dataset['HeartRate'].apply(get_number)
    dataset['SPO_Values'] = dataset['SPO_Values'].apply(get_number)
    dataset = dataset[dataset.HeartRate >= 40]
    dataset = dataset[dataset.HeartRate <= 180]
    dataset = dataset[dataset.SPO_Values <=  100]
    dataset = dataset[dataset.SPO_Values >= 88]
    return dataset

def dataStats(dataset):
    # HeartRate Zone
    average = dataset['HeartRate'].mean()
    length = len(dataset)
    maxVal = dataset['HeartRate'].max()
    count_max = dataset.HeartRate.value_counts()[maxVal]
    VO2Max = count_max/length * 100
    # 70 to 85 % of max hearrate
    fatBurnVals = dataset[dataset['HeartRate'].between(int(0.7*maxVal)-5, int(0.85*maxVal), inclusive=True)]
    fatBurn = len(fatBurnVals['HeartRate'])/length * 100
    # relax 50~100 beats per minute
    relaxVal = dataset[dataset['HeartRate'].between(50, 100, inclusive=True)]
    relax = len(relaxVal['HeartRate'])/length*100
    SPO2 = dataset['SPO_Values'].max()
    # print(round(average), round(VO2Max,2), round(fatBurn,2), round(relax,2), SPO2)
    return round(average), round(VO2Max,2), round(fatBurn,2), round(relax,2), SPO2

#ToDO: part of preprocessing, adapt according to Daniel's work
def get_number(text):
    text = str(text)
    try:
        if '=' in text:
            val = text.split('=')[1].strip()
            try:
                val = int(val)
            except ValueError:
                val = np.NaN
        elif text.isnumeric():
            val = int(float(text))
        elif '=-' in text:
          val = text.split('=-')[1].strip()
          try:
              val = int(val)
          except ValueError:
              val = np.NaN
        else:
            val = np.NaN
    except:
        print(text)
        raise ValueError()
    
    return val

if (__name__ == "__main__"):
     app.run(port = 5000)

