import pandas as pd
import json,re,glob


df = pd.read_csv('./fagraph.csv', index_col=0)
graph = json.load(open('./graph.json'))
graphlinks = pd.DataFrame(graph['rxns']).sum(axis=1)      


spec = df[list(filter(lambda x: '_' in x, df.columns))].sum(axis=0)
mech = list(spec.index)
mech.sort()



f = glob.glob('mechanisms/*kpp')

eqn = {}
for i in f:
    m = i.split('/')[-1].rsplit('.',1)[0]
    eqn[m]= len(re.findall('\d+\.}',open(i).read()))
    
    
for m in mech:
    print(m)
    print ('')
    print('Species:',spec.loc[m])
    print('Reactions:', eqn[m])
    print('Density: %.1e'%(graphlinks.loc[m]/spec.loc[m]**2))
    print('')