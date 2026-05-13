import requests
import json
import time
start = time.time()
response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "llama3",
        "prompt": "tell me about th dinosaurs.",
        "stream": True
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        chunk = json.loads(line)
        print(chunk.get("response", ""), end="")

end = time.time()
print(f"Total Time Taken: {end - start:.2f} seconds")