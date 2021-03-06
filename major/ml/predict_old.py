# predict context based on a single classifier
import pickle
import nltk
from featuredict import features
import sys
import re
from random import randint
import numpy as np
from categories import ds

# def predict(url,category):
def predictcontext(url):
    # classifier_f = open("./classifiers/naivebayes%s.pickle"%category, "rb")
    # classifier_f = open("./classifiers/svm%s.pickle"%category, "rb")
    # classifier_f = open("./classifiers/naivebayes.pickle", "rb")
    classifier_f = open("./classifiers/svm.pickle", "rb")
    classifier = pickle.load(classifier_f,encoding='latin1')

    # url = sys.argv[1]
    featdict = {}

    # print(url)
    featureset = re.sub('[\s!@#$+_.\-/:=&?~\d]',' ', url)
    # print(featureset)
    templist = featureset.split(" ")
    templist = list(filter(None, templist))
    # print(templist)
    length = len(templist)
    if(length>3):
        n = 4
        grams = nltk.ngrams(featureset.split(), n)

    else:
        n = length
        # print("No of words %s"%n)

    grams = nltk.ngrams(featureset.split(), n)
    # print(fourgrams)
    count = 0

    for gram in grams:
        count = count+1
        url_feature = features.copy()
        # print("\ncontext %s"%count)
        for val in range(n):
            if( gram[val] in url_feature ):
                url_feature[gram[val]]=True
            else:
                url_feature[val] = True

        # if( grams[1] in url_feature ):
        #     url_feature[grams[1]]=True
        # else :
        #     url_feature[1] = True
        #
        # if( grams[2] in url_feature ):
        #     url_feature[grams[2]]=True
        # else :
        #     url_feature[2] = True
        #
        # if( grams[3] in url_feature ):
        #     url_feature[grams[3]]=True
        # else :
        #     url_feature[3] = True

        # try:
        #     url_feature[grams[0]]=True
        #     url_feature[grams[1]]=True
        #     url_feature[grams[2]]=True
        #     url_feature[grams[3]]=True
        # except KeyError:
        #         val = randint(0, 3)
        #         url_feature[padbits[val]] = True
        # print(grams)
        testdata=[]
        testdata.append((url_feature))
        # testdat;;a = [(url_feature,None)]
        # print(testdata)
        result = classifier.classify(testdata[0])
        print("Context :",ds[result])
        classifier_f.close()
        # return str(ds[result])

# predictcontext(sys.argv[1])
predictcontext(sys.argv[1])
# predictcontext(sys.argv[1],sys.argv[2])
