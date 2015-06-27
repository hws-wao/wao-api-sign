
## リクエスト

```
POST https://localhost/api/friends HTTP/1.1
Host: localhost
Content-Length: 49
Content-Type: application/json
X-Wao-Date: 2015-06-27T01:08:24.910Z

or__friends.weight__gte=450&or__friends.gender=
```

## 署名の作り方

### リクエストを正規化する

リクエスト送信元と送信先で同じリクエスト情報を元に署名を作る必要があるため、形式を整える。

#### リクエストメソッドを追加する

リクエストメソッドを大文字で追加し、その後に改行文字を置く。

```
POST

```

#### 正規URIを追加する

RFC 3986 準拠したURIを追加後、改行文字列を置く。

- 各パスセグメントをURIエンコードする
- 絶対パスが空の場合、 / を設定する

```
POST
/api/friends

```

#### 正規クエリ文字列を追加する

- 各パラメータ名と値をURIエンコードする
- パラメータを文字コード（ASCIIコード）でソートする
- パラメータ毎に```[エンコード済みパラメータ名]=[エンコード済み値]```という形式に変換する
- ```&```で変換済みパラメータをつなぐ
- できた正規クエリ文字列を追加後、改行文字を置く

```
POST
/api/friends
or__friends%2egender=&or__friends%2eweight__gte=450

```

#### 正規ヘッダー

送信するリクエスト内に含まれる、Authorizationヘッダ以外の、全てのヘッダ情報を正規化し、追加する。

- 全てのヘッダー名を小文字に変換する
- ヘッダー値にある連続するスペースを1つのスペースに変換（""で囲まれた文字列のスペースは取り除かない）
- 文字コード（ASCIIコード）でヘッダーをソートする
- 全てのヘッダー値の後に改行文字を置く
- 重複したヘッダーの値は、カンマ区切りの文字列に変換する

```
POST
/api/friends
or__friends%2egender=&or__friends%2eweight__gte=450
Content-Length: 49
Content-Type: application/json
Host: localhost
X-Wao-Date: 2015-06-27T01:08:24.910Z

```

#### 署名ヘッダー

正規ヘッダーのヘッダー名を;でつないだ文字列

```
POST
/api/friends
or__friends%2egender=&or__friends%2eweight__gte=450
content-length: 49
content-type: application/json
host: localhost
x-wao-date: 2015-06-27T01:08:24.910Z
content-length;content-type;host;x-wao-date

```

#### ハッシュペイロード

HTTP または HTTPS リクエストの本文のペイロードからハッシュ値を作成して追加する。署名アルゴリズムにはSHA-256を使用する。

```
POST
/api/friends
or__friends%2egender=&or__friends%2eweight__gte=450
content-length: 49
content-type: application/json
host: localhost
x-wao-date: 2015-06-27T01:08:24.910Z
content-length;content-type;host;x-wao-date
2a022771b3c785b97de1fc6f70bb4b0356d84da2ba7048f5c84841041994e5e4
```

#### 正規リクエストをハッシュする

正規化したリクエストをSHA-256でハッシュします。ハッシュした結果は署名文字列で使用します。

```
c09a22bcac852bf57f899b1b460377ea7403c273edbbb0cd4216da09f16fa512
```
