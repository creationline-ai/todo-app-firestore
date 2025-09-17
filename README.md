# Todo App Test

React + TypeScript + Tailwind CSS を使用したTodoアプリケーションです。

## 技術スタック

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.4.8
- **Language**: TypeScript 5.5.3
- **Styling**: Tailwind CSS 3.4.13
- **UI Components**: Radix UI
- **Icons**: Lucide React

## MCP (Model Context Protocol) 統合

このプロジェクトには **Context7 MCP Server** が統合されており、AIアシスタントに最新のドキュメントとコード例をリアルタイムで提供します。

### Context7の特徴

- **リアルタイムドキュメント取得**: 公式ソースから最新のドキュメントを直接取得
- **バージョン固有のサポート**: プロジェクトの具体的なバージョンに基づいた正確な情報提供
- **多様なツールとの互換性**: Cursor、Claude Desktop、VS Code、Zedなどと統合可能

### 使用方法

AIアシスタントとの会話で以下のようにプロンプトに `use context7` を追加してください：

```
ReactのuseStateフックの最新の使用方法を教えて。use context7
```

```
Tailwind CSSの最新のグリッドレイアウトの書き方を教えて。use context7
```

### 設定ファイル

- **VS Code**: `.vscode/settings.json`
- **Claude Desktop**: `claude_desktop_config.json`
- **汎用MCP設定**: `mcp.json`

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リンター実行
npm run lint

# プレビュー
npm run preview
```

## 前提条件

- Node.js v18以上
- npm または yarn

## インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## MCP Server の動作確認

Context7 MCP Serverが正常に動作しているかを確認するには：

```bash
# Context7 MCP Serverの動作テスト
npx @upstash/context7-mcp@latest
```

## プロジェクト構成

```
src/
├── components/          # Reactコンポーネント
│   └── ui/             # UIコンポーネント（Radix UI）
├── hooks/              # カスタムフック
├── lib/                # ユーティリティ関数
├── App.tsx             # メインアプリケーション
├── main.tsx            # エントリーポイント
└── index.css           # グローバルスタイル
```

## ライセンス

このプロジェクトはプライベートリポジトリです。

## 更新履歴

- 2025-09-17: Devin による動作確認テスト完了
