# flask server
from betterPredict import predictcontext
import os
from random import *
from flask import Flask, request
# from categories import ds
from flask import jsonify
from titleContextPredict import predictTitleContext
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

@app.route("/findcontext",methods=['POST', 'GET'])
def findcontext():
	# if request.method=='POST':
	if request.method=='GET':
		url = str(request.args.get('url'))
		# url = request.form['url']
		response = dict()
		# response['context'] = 'water'

		if url.find('youtube')!=1:
			print(url)
			context = predictcontext(url)
		# print(context1)
# title predict
		else:
			print("\ntitle context")
			r = requests.get(url)
			data = r.text
			soup = BeautifulSoup(data,"lxml")
			title = soup.title.text
			context = predictTitleContext(title)
			print(context)

		response['context'] = context
		return jsonify(response)

@app.route("/addFilter",methods=['POST', 'GET'])
def addFilter():
	if request.method=='GET':
		print("User Filter added!!")
		filterList = str(request.args.get('filter'))
		fd = open("./userfilter.txt","w")
		fd.write(filterList)
		print("filter added successfully")
		return '', 204
		fd.close()

if __name__ == "__main__":
	app.secret_key = os.urandom(12)
	app.run(port=8080,debug = True)
