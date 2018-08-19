# current svmtrainer
from featuredict import features
import pandas as pd
import nltk
import pickle
from categories import ds
from sklearn.svm import LinearSVC

classifier_f = open("./classifiers/svm10.pickle", "rb")
classifier = pickle.load(classifier_f,encoding='latin1')

padbits = ["_paddingbit1","_paddingbit2","_paddingbit3","_paddingbit4"]
src ='./dataset/dmoz0409_finaltest.csv'

csvfile = pd.read_csv(src)
# str_url = (csvfile.iloc[:,1:])
urls = csvfile.values.tolist()
fullset =[]

fullset =[]

for content in urls:
    url_class = features.copy()
    try:
        url_class[content[0]]=True
        url_class[content[1]]=True
        url_class[content[2]]=True
        url_class[content[3]]=True
    except KeyError:
        url_class[padbits[val]] = True

    res = content[4]
    fullset.append((url_class,res))
    # fullset.append(url_class)
    # print(fullset)

# training_set = fullset
testing_set = fullset
# print(testing_set)
msg = " Classifier accuracy percent: "+str(nltk.classify.accuracy(classifier, testing_set)*100)
print(msg)
classifier_f.close()
