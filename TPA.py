from flask import Flask, send_file

app = Flask('TPA')

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/<filename>')
def get_file(filename):
    return send_file(filename)

app.run(debug=True, port=3000, host='0.0.0.0')