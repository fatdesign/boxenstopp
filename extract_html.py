import os
import re
from html.parser import HTMLParser

class CleanHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.indent = 0

    def handle_starttag(self, tag, attrs):
        attrs_str = " ".join([f'{k}="{v}"' for k, v in attrs if k not in ['class', 'style', 'src', 'href']])
        # Only keep interesting attributes like id, href, etc.
        interesting_attrs = []
        for k, v in attrs:
            if k in ['id', 'href', 'src', 'alt', 'type', 'name', 'value', 'placeholder']:
                if len(v) > 100:  # Truncate base64
                    v = v[:50] + "...base64..."
                interesting_attrs.append(f'{k}="{v}"')
        
        attrs_str = " " + " ".join(interesting_attrs) if interesting_attrs else ""
        self.result.append("  " * self.indent + f"<{tag}{attrs_str}>")
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.indent += 1

    def handle_endtag(self, tag):
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.indent = max(0, self.indent - 1)
        self.result.append("  " * self.indent + f"</{tag}>")

    def handle_data(self, data):
        data_stripped = data.strip()
        if data_stripped:
            self.result.append("  " * self.indent + f"TEXT: {data_stripped}")

# Read boxenstopp-vorschau.html
file_path = r"c:\Users\Limitless\.gemini\antigravity\scratch\boxenstopp\# Infos\boxenstopp-vorschau.html"
with open(file_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Let's also strip out huge base64 blocks before parsing to speed things up and avoid memory issues
html_clean = re.sub(r'data:image/[^;]+;base64,[^"]+', 'data:image/...base64...', html_content)

parser = CleanHTMLParser()
parser.feed(html_clean)

output_path = r"c:\Users\Limitless\.gemini\antigravity\scratch\boxenstopp\clean_structure.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(parser.result))

print("Done! Clean structure written to clean_structure.txt")
