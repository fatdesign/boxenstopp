import re

# Read clean_structure.txt and filter for TEXT lines
with open("c:\\Users\\Limitless\\.gemini\\antigravity\\scratch\\boxenstopp\\clean_structure.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

text_lines = []
for line in lines:
    m = re.search(r'TEXT:\s*(.*)', line)
    if m:
        val = m.group(1).strip()
        if val:
            text_lines.append(val)

# Write to extracted_text.txt
with open("c:\\Users\\Limitless\\.gemini\\antigravity\\scratch\\boxenstopp\\extracted_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(text_lines))

print("Done! Extracted text lines to extracted_text.txt")
