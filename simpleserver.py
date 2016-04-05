import SimpleHTTPServer
import SocketServer
from sys import argv


try:
	PORT = int(argv[1])
except:
	PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()