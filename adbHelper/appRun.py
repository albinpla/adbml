# flask server
import os
from random import *
from flask import Flask, request
import requests,bs4
# import pandas as pd

app = Flask(__name__)

@app.route("/logUrl",methods=['POST', 'GET'])
def findcontext():
	# if request.method=='POST':
	if request.method=='GET':
		url = str(request.args.get('url'))
		context = str(request.args.get('context'))
		fd = open("./title.csv","a")
		r = requests.get(url)
		data = r.text
		soup = bs4.BeautifulSoup(data,"lxml")
		title = soup.title.text
		line = title+","+context+"\n"
		fd.write(line)
		print(url)
		print(context)
		return '', 204

if __name__ == "__main__":
	app.secret_key = os.urandom(12)
	app.run(port=8080,debug = True)
