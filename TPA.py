from flask import Flask, send_file, request
from datetime import datetime
import os

app = Flask('TPA')
group = '7b'

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/getData')
def getData():
    fpath = group+'/'+group+'-groupData'
    with open(fpath, 'r') as myfile:
        data = myfile.read()
    return data

@app.route('/<filename>')
def get_file(filename):
    return send_file(filename)

@app.route('/groupData')
def get_groupData():
    return send_file(group+'/'+group+'-groupData.js')

@app.route('/wait4NFC')
def NFC():
    print('Enter student number: ')
    id = input()
    return str(id)

@app.route('/todayData', methods=['POST'])
def save():
    data = request.get_json()
    print(data)
    fpath = group+'/'+group+'-groupData'
    nfilepath = group+'/'+group+'-groupData-'+datetime.strftime(datetime.now(), "%d-%m-%Y")
    os.rename(fpath, nfilepath)
    f = open(fpath, 'w')
    f.write(request.data)
    f.close()
    return request.data 

app.run(debug=True, port=3000, host='0.0.0.0')