import re

with open("c:\\Users\\Limitless\\.gemini\\antigravity\\scratch\\boxenstopp\\extracted_text.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

filtered = []
for line in lines:
    text = line.strip()
    if not text:
        continue
    # Exclude CSS / JS code blocks
    if "@layer" in text or "tailwindcss" in text or "pointer-events-none" in text or "font-family:" in text or "{" in text or "}" in text:
        continue
    filtered.append(text)

with open("c:\\Users\\Limitless\\.gemini\\antigravity\\scratch\\boxenstopp\\filtered_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(filtered))

print("Filtered text count:", len(filtered))
