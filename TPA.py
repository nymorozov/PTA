from flask import Flask, send_file, request
from flask_socketio import SocketIO
from datetime import datetime
import os
import time

app = Flask('TPA')
socketio = SocketIO(app)
group = ''
UIDs = []
mainip = ''



@app.route('/')
def index():
    return send_file('index.html')

@app.route('/grName<GRNAME>')
def grname(GRNAME):
    global group
    group = GRNAME
    fpath = group+'/'+group+'-groupUIDs'
    with open(fpath, 'r') as myfile:
       data = myfile.read()
    global UIDs
    UIDs = data.split(';\n')
    return 'Working w/'+group

@app.route('/getData')
def getData():
    mainip = request.remote_addr
    fpath = group+'/'+group+'-groupData'
    with open(fpath, 'r') as myfile:
        data = myfile.read()
    return data

@app.route('/<filename>')
def get_file(filename):
    return send_file(filename)

@app.route('/css/<filename>')
def get_cssfile(filename):
    return send_file('css/'+filename)

@app.route('/js/<filename>')
def get_jsfile(filename):
    return send_file('js/'+filename)

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

@app.route('/UID[<uid>]')
def receiveUID(uid):
    print('The id is '+str(UIDs.index(uid)))
    socketio.emit('uid', UIDs.index(uid))
    #socketio.emit('uid', 'hi')
    return 'WoW'

socketio.run(app, debug=True, port=3000, host='0.0.0.0')
