# current svmtrainer
from featuredict import features
import pandas as pd
import nltk
import pickle
from categories import ds
from sklearn.svm import LinearSVC
import sys

# number = 1
try:
    number = sys.argv[1]
except Exception as e:
    number = 10
# print(number)
classif = nltk.classify.scikitlearn.SklearnClassifier(LinearSVC())

padbits = ["_paddingbit1","_paddingbit2","_paddingbit3","_paddingbit4"]
# category = ds[int(sys.argv[1])-1]
# src ='./dataset/dmoz0409_%s_finaltest.csv'%category
src ='./dataset/dmoz0409_finaltest.csv'
# print(src)
csvfile = pd.read_csv(src)
# # str_url = (t.iloc[:,1:]
urls = csvfile.values.tolist()

fullset =[]

for content in urls:
    url_class = features.copy()
    try:
        url_class[content[0]]=True
        url_class[content[1]]=True
        url_class[content[2]]=True
        url_class[content[3]]=True
    except KeyError:
        # val = randint(0, 3)
        url_class[padbits[val]] = True

    res = content[4]
    # if content[4] == -1:
        # res = "neg"
    # else :
        # res = "pos"
    fullset.append((url_class,res))
    # fullset.append(url_class)
    # print(fullset)
# print(url_class)
# training_set = url_class[:1900]
#
# # set that we'll test against.
training_set = fullset
# testing_set = fullset[100:]
# print(testing_set)
# print(sys.getsizeof(training_set)/1000000000)
print("Training SVM...\n")
classifier = classif.train(training_set)
print("Successfully trained!!!")
print(" saved to ./classifiers/svm%s.pickle"%number)
save_classifier = open("./classifiers/svm%s.pickle"%number,"wb")
pickle.dump(classifier, save_classifier)
save_classifier.close()

# msg = " Classifier accuracy percent: "+str(nltk.classify.accuracy(classifier, testing_set)*100)
# print(msg)
#
#
#
# fd = open("./accuracy.txt",'a',encoding = "utf-8")
# fd.write(category+msg+"\n")
# fd.close()
# testset [(,,,)]
# classifier_f = open("./classifiers/naivebayes%s.pickle"%category, "rb")
# classifier = pickle.load(classifier_f)
# classifier_f.close()
