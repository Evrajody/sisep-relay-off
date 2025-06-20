import os

## npx nuxi cleanup

def main() -> int:
    print("[~] Nuxt UI Pro license bypass by @qweme32\n")
    path = "./node_modules/@nuxt/ui-pro/modules/pro/index.ts"

    print("[*] Looking for index file at", path)
    if not os.path.exists(path):
        print(f"[-] Index file not found at {path}")

        return 1

    with open(path, "r", encoding="utf-8") as file:
        content = file.read()

    if "build:befores" in content:
        return 2

    print("[*] Canceling the validation waiting")

    content = content.replace(
        "build:before",
        "build:befores",
    )

    with open(path, "w", encoding="utf-8") as file:
        file.write(content)

    return 0


if __name__ == "__main__":
    status = main()

    if status == 0:
        print("\n[+] License check bypassed")
    elif status == 2:
        print("\n[+] License check already bypassed")
    else:
        print("\n[-] Failed. Check logs")