# UI Extras ライブラリ レポート

本ドキュメントでは、Image Box App で使用している4つのUIライブラリについて、導入目的・使用箇所・設定内容・効果を網羅的にまとめる。

---

## 1. Framer Motion

### 概要

React向けの宣言的アニメーションライブラリ。`motion` コンポーネントで要素をラップし、`initial` / `animate` / `exit` プロパティでアニメーションを定義する。

### 使用箇所と効果

| コンポーネント | インポート | アニメーション種別 | 効果 |
|---|---|---|---|
| `MainComponents.tsx` | `motion` | フェードイン (`opacity: 0→1`) | フォルダ・画像グリッドがローディング完了後にスムーズに表示される |
| `SignInForm.tsx` | `motion` | フェードイン + スライドアップ (`opacity: 0→1, y: 20→0`) | ログインフォームがページ読み込み時に上方向へ滑らかに出現する |
| `ImageCard.tsx` | `motion` | フェードイン + スケール (`opacity: 0→1, scale: 0.95→1`) | 各画像カードがズームインしながら表示される |
| `FolderCard.tsx` | `motion` | フェードイン + スケール (`opacity: 0→1, scale: 0.95→1`) | 各フォルダカードがImageCardと同一の挙動で統一感を持たせる |
| `UploadComponents.tsx` | `motion`, `AnimatePresence` | フェードイン + スライドダウン (`opacity: 0→1, y: 10→0`) + 退出アニメーション | ファイル選択リストの表示・非表示が滑らかに切り替わる |

### アニメーションパターンの分類

1. **エントランスアニメーション**: 全5コンポーネントで使用。要素の初回描画時にフェード・スライド・スケールを組み合わせた出現効果を提供する。
2. **条件付きレンダリングアニメーション**: `UploadComponents.tsx` のみ `AnimatePresence` を使用。動的に追加・削除されるファイルリストの表示切り替えに退出アニメーションを適用する。

### 設計方針

- アニメーションはすべて控えめでデフォルトのタイミングを使用し、UXを妨げない。
- カスタムバリアント・ジェスチャーアニメーション・複雑なトランジションは未使用。
- カード系コンポーネント（ImageCard / FolderCard）は同一のアニメーション設定で視覚的統一性を確保。

---

## 2. react-dropzone

### 概要

ファイルのドラッグ＆ドロップおよびクリック選択を実現するReactフック。`useDropzone` フックを使い、ファイル入力エリアを構築する。

### 使用箇所

`UploadComponents.tsx` のみで使用。

### 設定内容

```
useDropzone({
  accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
  onDrop: (acceptedFiles) => setFiles(prev => [...prev, ...acceptedFiles])
})
```

| 設定項目 | 値 | 備考 |
|---|---|---|
| 受付MIMEタイプ | `image/*` | 画像ファイルのみ |
| 受付拡張子 | `.png`, `.jpg`, `.jpeg`, `.gif` | 4種類に限定 |
| 最大ファイルサイズ | 未設定 | サーバー側で制御 |
| 複数ファイル | 対応 | ドロップするたびにリストへ追加 |

### ドロップゾーンUI

- `getRootProps()` でコンテナdivにドロップゾーン動作をバインド。
- `getInputProps()` で隠しファイル入力を生成し、クリック選択も可能。
- `isDragActive` 状態に応じてスタイルを動的に切り替え:
  - **ドラッグ中**: `border-primary bg-primary/5`（プライマリカラーの枠線と薄い背景）
  - **通常時**: `border-muted-foreground/25`（控えめな破線ボーダー）
- ドロップゾーン内にLucideの `Upload` アイコン（h-12 w-12）と説明テキストを配置。

### アップロードフロー

1. ユーザーがファイルをドラッグ＆ドロップまたはクリック選択
2. `onDrop` でファイルリストのstateに追加（複数回の追加が可能）
3. 各ファイル横の `X` ボタンで個別削除可能
4. 「Upload」ボタンで `addImages()` APIを呼び出し
5. アップロード中はプログレスバーを表示
6. 成功時: toast.success → ファイルリストをクリア
7. 失敗時: toast.error → エラー通知

---

## 3. Lucide React

### 概要

軽量でカスタマイズ可能なSVGアイコンライブラリ。ツリーシェイキングに対応し、使用するアイコンのみがバンドルに含まれる。

### 使用アイコン一覧（全16種類）

| アイコン名 | 使用コンポーネント | 用途 | サイズ |
|---|---|---|---|
| `Upload` | UploadComponents | ドロップゾーンのビジュアル | `h-12 w-12` |
| `X` | UploadComponents, toast, dialog | ファイル削除ボタン / 閉じるボタン | `h-4 w-4` |
| `LogIn` | UploadComponents, MainComponents | ログインボタン | `h-4 w-4` |
| `LogOut` | UploadComponents, MainComponents | ログアウトボタン | `h-4 w-4` |
| `Check` | checkbox (UI) | チェックボックスのチェックマーク | `h-4 w-4` |
| `Sun` | mode-toggle | ライトモードアイコン | `h-[1.2rem] w-[1.2rem]` |
| `Moon` | mode-toggle | ダークモードアイコン | `h-[1.2rem] w-[1.2rem]` |
| `ImagePlus` | MainComponents | 画像アップロードボタン / 空状態の表示 | `h-4 w-4` / `h-12 w-12` |
| `Trash2` | MainComponents | 選択アイテム削除ボタン | `h-4 w-4` |
| `Mail` | SignInForm | メール入力欄のアイコン | `h-4 w-4` |
| `Lock` | SignInForm | パスワード入力欄のアイコン | `h-4 w-4` |
| `ImageIcon` | Header | ロゴ / ギャラリーナビゲーション | `h-6 w-6` / `h-4 w-4` |
| `UploadIcon` | Header | アップロードナビゲーション（認証時のみ） | `h-4 w-4` |
| `FolderIcon` | FolderCard | フォルダカードのアイコン | `h-4 w-4` |
| `FolderPlus` | CreateFolderDialog | 新規フォルダ作成ボタン | `h-4 w-4` |
| `ChevronRight` | BreadcrumbNav | パンくずリストのセパレータ | `h-4 w-4` |
| `Home` | BreadcrumbNav | ホームナビゲーション | `h-4 w-4` |

### サイズ規約

| サイズ | 用途 | 使用数 |
|---|---|---|
| `h-4 w-4` | ボタン内アイコン（標準） | 約35箇所 |
| `h-12 w-12` | 空状態・ドロップゾーン（大型） | 2箇所 |
| `h-6 w-6` | ヘッダーロゴ | 1箇所 |
| `h-[1.2rem] w-[1.2rem]` | テーマトグル | 2箇所 |

### スタイル規約

- ボタン内アイコンには `mr-2` で右マージンを統一。
- 入力欄アイコンは `absolute left-3 top-3 text-gray-400` で絶対配置。
- 空状態アイコンは `text-muted-foreground` でトーンダウン。
- テーマトグルアイコンはCSS transitionで回転＋スケールアニメーション。

---

## 4. Sonner

### 概要

軽量なトースト通知ライブラリ。`toast.success()` / `toast.error()` などのシンプルなAPIで通知を表示する。

### セットアップ

**プロバイダ構成**:
- `src/components/ui/sonner.tsx` でカスタムToasterコンポーネントを定義。
- `src/app/layout.tsx` のルートレイアウトで `ThemeProvider` 内にマウント。
- `next-themes` の `useTheme()` と連携し、ライト/ダークモードに自動対応。

**スタイル設定**:
- Tailwindのグループセレクタ (`group-[.toaster]`, `group-[.toast]`) でSonnerのDOM構造を変更せずにカスタムスタイルを適用。
- 背景色・テキスト色・ボーダー・シャドウをアプリケーションのデザインシステムと統一。

### トースト通知一覧

#### 成功通知 (`toast.success`) — 4箇所

| コンポーネント | メッセージ | トリガー |
|---|---|---|
| UploadComponents | `'Files uploaded successfully'` | ファイルアップロード完了 |
| UploadComponents | `'SignOut Successed'` | サインアウト成功 |
| MainComponents | `` `Deleted ${selectedItems.size} items` `` | アイテム削除成功（動的カウント） |
| MainComponents | `` `Created folder: ${name}` `` | フォルダ作成成功（動的名前） |
| SignInForm | `'Login Successed'` | ログイン成功 |

#### エラー通知 (`toast.error`) — 8箇所

| コンポーネント | メッセージ | トリガー |
|---|---|---|
| UploadComponents | `'Please select files to upload'` | ファイル未選択でアップロード試行 |
| UploadComponents | `'Failed to upload files'` | アップロードAPI失敗 |
| UploadComponents | `'フォルダーの取得に失敗しました'` | フォルダ取得API失敗 |
| UploadComponents | `'SignOut Failed'` | サインアウト失敗 |
| MainComponents | `'Please select items to delete'` | アイテム未選択で削除試行 |
| MainComponents | `'Failed to delete folders'` | フォルダ削除API失敗 |
| MainComponents | `'Failed to delete images'` | 画像削除API失敗 |
| MainComponents | `'Failed to create folder'` | フォルダ作成API失敗 |
| MainComponents | `'データの取得に失敗しました'` | データ取得API失敗 |
| SignInForm | `'Login Failed'` | 認証失敗 |

### 使用パターン

- すべてのトースト呼び出しはクライアントコンポーネント (`'use client'`) 内。
- 非同期API操作の `try-catch` ブロックで使用。
- エラー通知は「何が失敗したか」を明記。
- 成功通知はアクション完了を確認。
- 一部メッセージは日本語（データ取得系のエラー）、その他は英語。

---

## 総括

| ライブラリ | バージョン | 主な役割 | 使用箇所数 |
|---|---|---|---|
| Framer Motion | `^11.11.15` | エントランスアニメーション・条件付きレンダリング | 5コンポーネント |
| react-dropzone | `^14.3.5` | ファイルドラッグ＆ドロップ | 1コンポーネント |
| Lucide React | `^0.456.0` | SVGアイコン（16種類） | 11コンポーネント |
| Sonner | `^1.7.0` | トースト通知（成功/エラー） | 3コンポーネント + グローバル設定 |

### 改善検討事項

1. **言語の統一**: トーストメッセージが日本語と英語で混在している。i18n対応またはどちらかに統一することを検討。
2. **ファイルサイズ制限**: react-dropzoneで `maxSize` が未設定。クライアント側でのバリデーション追加を検討。
3. **アニメーションの統一**: Framer Motionのアニメーション設定が各コンポーネントにインラインで記述されている。共通のアニメーション定数を `lib/animations.ts` などに切り出すことで保守性が向上する可能性がある。
4. **トーストメッセージの誤字**: `'SignOut Successed'` / `'Login Successed'` → 正しくは `'Succeeded'`。
