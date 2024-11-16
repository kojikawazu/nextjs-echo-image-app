# API仕様

詳細はTODO。

## フォルダー

### フォルダー情報取得

```
/api/folder?prefix=portal/
```

### フォルダー一覧取得

```
/api/folders?prefix=portal/
```

### フォルダー作成

```
/api/folders/create
```

#### リクエストボディ

```json
{
    "name": "folder-name",
    "parentId": "portal/"
}
```

### フォルダー削除

```
/api/folders/delete
```

#### リクエストボディ

```json
{
    "folderId": "portal/"
}
```

## 画像

### 画像一覧取得

```
/api/images?prefix=portal/
```

### 画像取得(key指定)

```
/api/images/[...key]
```

#### パスパラメータ

-   key: 画像のキー

### 画像アップロード

```
/api/images/create
```

#### リクエストボディ

```json
{
    "file": "[file]",
    "folderPath": "portal/"
}
```

### 画像削除

```
/api/images/delete
```

#### リクエストボディ

```json
{
    "key": "portal/image.jpg"
}
```
