## WAO API署名の作り方

### リクエスト

↓のリクエストを送信するための署名を作成する

```
POST https://localhost/api/friends HTTP/1.1
Host: localhost
Content-Length: 49
Content-Type: application/json
X-Wao-Date: 2015-06-27T01:08:24.910Z

or__friends.weight__gte=450&or__friends.gender=
```

### リクエストを正規化する

リクエスト送信元と送信先で同じリクエスト情報を元に署名を作る必要があるため、形式を整える。

#### リクエストメソッドを追加する

リクエストメソッドを大文字で追加し、その後に改行文字を置く。

```
POST\n
```

#### 正規URIを追加する

RFC 3986 準拠したURIを追加後、改行文字列を置く。

- 各パスセグメントをURIエンコードする
- 絶対パスが空の場合、 / を設定する

```
POST\n
/api/friends\n
```

#### 正規クエリ文字列を追加する

- 各パラメータ名と値をURIエンコードする
- パラメータを文字コード（ASCIIコード）でソートする
- パラメータ毎に```[エンコード済みパラメータ名]=[エンコード済み値]```という形式に変換する
- ```&```で変換済みパラメータをつなぐ
- できた正規クエリ文字列を追加後、改行文字を置く

```
POST\n
/api/friends\n
or__friends%2egender=&or__friends%2eweight__gte=450\n
```

#### 正規ヘッダー

送信するリクエスト内に含まれる、Authorizationヘッダ以外の、全てのヘッダ情報を正規化し、追加する。

- 全てのヘッダー名を小文字に変換する
- ヘッダー値にある連続するスペースを1つのスペースに変換（""で囲まれた文字列のスペースは取り除かない）
- 文字コード（ASCIIコード）でヘッダーをソートする
- 全てのヘッダー値の後に改行文字を置く
- 重複したヘッダーの値は、カンマ区切りの文字列に変換する

```
POST\n
/api/friends\n
or__friends%2egender=&or__friends%2eweight__gte=450\n
Content-Length: 49\n
Content-Type: application/json\n
Host: localhost\n
X-Wao-Date: 2015-06-27T01:08:24.910Z\n
```

#### 署名ヘッダー

正規ヘッダーのヘッダー名を;でつないだ文字列

```
POST\n
/api/friends\n
or__friends%2egender=&or__friends%2eweight__gte=450\n
content-length: 49\n
content-type: application/json\n
host: localhost\n
x-wao-date: 2015-06-27T01:08:24.910Z\n
content-length;content-type;host;x-wao-date\n
```

#### ハッシュペイロード

HTTP または HTTPS リクエストの本文のペイロードからハッシュ値を作成して追加する。署名アルゴリズムにはSHA-256を使用する。

```
POST\n
/api/friends\n
or__friends%2egender=&or__friends%2eweight__gte=450\n
content-length: 49\n
content-type: application/json\n
host: localhost\n
x-wao-date: 2015-06-27T01:08:24.910Z\n
content-length;content-type;host;x-wao-date\n
2a022771b3c785b97de1fc6f70bb4b0356d84da2ba7048f5c84841041994e5e4
```

#### 正規リクエストをハッシュする

正規化したリクエストをSHA-256でハッシュする。ハッシュした結果は署名文字列で使用する。

```
c09a22bcac852bf57f899b1b460377ea7403c273edbbb0cd4216da09f16fa512
```

### 署名文字列を作成する

#### 署名アルゴリズムを追加する

まず、署名アルゴリズムの後に改行文字を置きます。

```
HMAC-SHA-256\n
```
#### 要求日付を追加する

ISO8601基本形式（YYYYMMDD'T'HHMMSS'Z'）で要求日付を設置する。その後に改行文字を置く。

```
HMAC-SHA-256\n
2015-06-27T01:08:24.910Z\n
```

#### 正規リクエストのハッシュを追加する

「リクエストを正規化する」で作成した正規リクエストのハッシュを追加する。

```
HMAC-SHA-256\n
2015-06-27T01:08:24.910Z\n
c09a22bcac852bf57f899b1b460377ea7403c273edbbb0cd4216da09f16fa512
```

### 署名を計算する

#### WAOで署名キーを取得します

```html
<meta name="wao-signature-key" />
    ↓ nameがwao-signature-keyのmeta要素を設置すると、contentに署名キーがレンダリングされる
<meta name="wao-signature-key" content="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
```

#### 署名

署名キーをキーにして、署名文字列を元に署名を作成する。
署名は、16進表示でリクエストで使用する。

#### 署名例

```
7668d2cd32a37eb45b51f002690d1b9a7c03f2da91791f96227ba9a61952fce8
```

### リクエスト用ヘッダを追加する

#### アクセスキーを取得する

WAOからアクセスキーを取得する。

```
<meta name="wao-access-key" />
```

#### Authorizationヘッダーを作成

下記の形式で作成する。

```
Authorization: algorithm Credential=access key ID, SignedHeaders=SignedHeaders, Signature=signature
```
  ↓ 値を設定した場合
```
Authorization: HMAC-SHA256 Credential=AK849JFKK, SignedHeaders=content-length;content-type;host;x-wao-date, Signature=7668d2cd32a37eb45b51f002690d1b9a7c03f2da91791f96227ba9a61952fce8
```
