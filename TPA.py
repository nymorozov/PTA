from flask import Flask, send_file

app = Flask('TPA')
group = '7b'

@app.route('/')
def index():
    return send_file('index.html')

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

app.run(debug=True, port=3000, host='0.0.0.0')