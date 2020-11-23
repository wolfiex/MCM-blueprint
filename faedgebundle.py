'''
pip install datashader scikit-image
'''
import sys
if sys.version_info[0] < 3:
    print('You need to run hb3d with Python 3 - sorry it sucks, I know! ')
    sys.exit(1)

#imports
from datashader.bundling import hammer_bundle
from scipy.interpolate import CubicSpline
import pandas as pd
import numpy as np
import multiprocessing, time


import json,re,os,glob
graph = json.load(open('./graph.json'))


import datashader as ds
from datashader.bundling import hammer_bundle

import pandas as pd


def edges2num (nodes,edgelist,name='id'):
    '''
    A function to convert a named edge list into a numerical one for edge bundling.

    nodes :: pd dataframe -> the x,y,z and node name dataframe lsit
    edgelist :: list -> a list of elements [source_name, target_name]
    name :: str -> the dataframe column containing node names
    '''
    name_dict = list(nodes[name].values)

    edges=pd.DataFrame([[name_dict.index(j) for j in i.split()] for i in edgelist], columns=['source','target'])

    return edges


nodedf = pd.read_csv('./fagraph.csv', index_col=0)
edges = edges2num(nodedf,graph['rxns'].keys())

output = hbparams = {
    'batch_size' : 50000,
    'tension' : .85,
    'accuracy' : 800
    }


nodes = pd.DataFrame()
nodes['name'] = [str(i) for i in (nodedf['id'].values)]
nodes['x']    = [float(i)  for i in (nodedf['x'].values)]
nodes['y']    = [float(i)  for i in (nodedf['y'].values)]

hb = hammer_bundle(nodes,edges,**hbparams)


## Speed this part up
edgepaths = {}

for j,k in enumerate(['x','y']):
    edgepaths[k] = [ np.array(i.split()).astype(float) for i in ' '.join(hb[['x','y'][j]].astype(str)).split('nan')]





for i,j in enumerate( list(graph['rxns'].keys())):
    graph['rxns'][j]['bundle'] = list(zip(edgepaths['x'][i],edgepaths['y'][i] ))


import json

jstr = json.dumps(graph, indent=4)

with open('./fabundle.json','w') as f:
    f.write(jstr)



#
#
# output.to_csv('../src/bundle.csv')
