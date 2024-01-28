# Palworld Bot インストール手順
## 1. Node.jsのインストール
自分の環境ではすでにNode.jsをインストール済みだったため、試していない。以下が参考になるかもしれない。
https://qiita.com/nanbuwks/items/ed8adb2d4324c939a349

## 2. ルートディレクトリの作成
```
mkdir my-discord-bot
cd my-discord-bot
```
「my-discord-bot」は任意の名前で良い。

## 3. npmの初期化
```
npm init -y
```
実行後、ルートディレクトリ直下に「package.json」が作成されていることを確認。

## 4. discord.jsのインストール
```
npm install discord.js
```
実行後、ルートディレクトリ直下に「node-module」のフォルダが作成され、さらにその直下に「@discordjs」、「discord.js」等のフォルダが作成され、discord.jsがインストールされる。

## 5. aws-sdk(v3)のインストール
```
npm install @aws-sdk/client-ec2
```
4.で作成された「node-module」に「@aws-sdk」等のフォルダが作成され、aws-sdkがインストールされる。
`npm install aws-sdk`を紹介しているサイトもあるが、これはv2という古いバージョンのため、注意。

## 6. config.jsonの配置
別途共有する「config.json」をルートディレクトリに配置。

## 7. プログラムの実行
```
node index.js
```
