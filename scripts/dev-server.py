"""Static dev server that refuses to let anything cache.

Plain `python -m http.server` sends no Cache-Control header, so browsers fall
back to *heuristic* caching: they re-serve a stale copy without even asking the
server if it changed. That makes edits appear not to take effect until you
hard-reload or add a ?cachebust= param. This wrapper sends no-store on every
response so a normal refresh always shows current files.

Usage:  python scripts/dev-server.py [port]   (default 8080, serves the cwd)
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # SimpleHTTPRequestHandler answers If-Modified-Since with a 304, which
        # would re-introduce staleness through a conditional request. Drop the
        # validators so every request is served fresh.
        for header in ("If-Modified-Since", "If-None-Match"):
            while header in self.headers:
                del self.headers[header]
        return super().send_head()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = ThreadingHTTPServer(("", port), NoCacheHandler)
    print("Serving %s on http://localhost:%d (no-cache)" % (sys.path[0] or ".", port))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
