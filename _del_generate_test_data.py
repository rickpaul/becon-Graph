import json

file_path = './data/g.json'

if __name__ == '__main__':
	out = []
	for i in xrange(100):
		out.append((100-i,i))
	with open(file_path, 'wb') as writer:
		json.dump(out, writer)
