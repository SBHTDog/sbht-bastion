# sbht-bastion

<details open>
<summary><strong>🇰🇷 한국어</strong></summary>

## 📋 프로젝트 개요

**sbht-bastion**은 배포 관리 및 GitHub 통합을 담당하는 관리 서비스입니다. GitHub OAuth를 통한 인증, 웹훅 이벤트 수신, 실시간 모니터링 기능을 제공하여 개발 워크플로우를 관리합니다.

이 프로젝트는 Softbank Hackerthon 2025를 위한 SBHTDog 조직의 Bastion 서비스 저장소입니다.

## ✨ 주요 기능

### 🔐 GitHub OAuth 인증

- **안전한 로그인**: GitHub OAuth 2.0을 통한 사용자 인증
- **세션 관리**: 쿠키 기반 세션 관리
- **권한 제어**: 사용자 프로필 및 저장소 접근 권한

### 📊 대시보드

- **사용자 프로필**: GitHub 사용자 정보 표시
  - 아바타, 이름, 회사, 위치
  - 팔로워/팔로잉 수
  - 공개 저장소 수
- **저장소 목록**: 사용자의 모든 저장소 표시
  - 저장소 이름, 설명, 언어
  - 스타 수, 포크 수
  - 마지막 업데이트 시간

### 📡 GitHub Webhook 수신

- **실시간 이벤트 수신**: GitHub 저장소의 모든 이벤트 수신
- **데이터베이스 저장**: PostgreSQL에 webhook 페이로드 저장
- **이벤트 타입**:
  - Push 이벤트
  - Pull Request
  - Issues
  - Release
  - 기타 모든 GitHub 이벤트

### 🔴 실시간 모니터링

- **Server-Sent Events (SSE)**: 실시간 이벤트 스트리밍
- **Webhook 모니터 페이지**:
  - 실시간 webhook 이벤트 표시
  - 연결 상태 모니터링
  - 하트비트 기능
- **자동 재연결**: 연결 끊김 시 자동 재연결

### 💾 데이터 관리

- **PostgreSQL 통합**:
  - Webhook 이벤트 영구 저장
  - JSONB 타입으로 유연한 쿼리 지원
  - 생성 시간 인덱싱
- **Event Emitter**:
  - 메모리 기반 이벤트 발행
  - 다중 클라이언트 지원

## 🛠️ 기술 스택

### 프론트엔드

- **Next.js 16.0.3**: React 기반 풀스택 프레임워크 (App Router)
- **React 19.2.0**: UI 컴포넌트 라이브러리
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### 백엔드

- **Next.js API Routes**: 서버리스 API 엔드포인트
- **Octokit (@octokit/rest)**: GitHub API 클라이언트
- **@octokit/auth-oauth-app**: OAuth 인증 라이브러리
- **pg**: PostgreSQL 클라이언트

### 데이터베이스

- **PostgreSQL**: 관계형 데이터베이스
  - JSONB 타입으로 webhook 페이로드 저장
  - GIN 인덱스로 빠른 JSONB 쿼리

### DevOps

- **Docker**: 컨테이너화
- **Docker Compose**: 로컬 개발 환경

## 📂 프로젝트 구조

```
sbht-bastion/
├── app/
│   ├── api/
│   │   ├── github/
│   │   │   └── route.ts              # GitHub API 프록시
│   │   └── webhooks/
│   │       ├── github/
│   │       │   └── route.ts          # Webhook 수신 엔드포인트
│   │       └── events/
│   │           └── route.ts          # SSE 이벤트 스트림
│   ├── auth/
│   │   └── github/
│   │       ├── login/
│   │       │   └── route.ts          # OAuth 로그인 시작
│   │       ├── callback/
│   │       │   └── route.ts          # OAuth 콜백 처리
│   │       └── logout/
│   │           └── route.ts          # 로그아웃
│   ├── dashboard/
│   │   └── github/
│   │       ├── page.tsx              # 대시보드 페이지
│   │       ├── actions.ts            # 서버 액션
│   │       └── LogoutButton.tsx      # 로그아웃 버튼
│   ├── webhooks/
│   │   └── monitor/
│   │       └── page.tsx              # 실시간 모니터링 페이지
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # 홈페이지
│   └── globals.css                   # 글로벌 스타일
├── src/
│   ├── github/
│   │   ├── ghacc.ts                  # GitHub 인증 유틸리티
│   │   └── webhook-emitter.ts       # Webhook 이벤트 에미터
│   └── db/
│       ├── dbacc.ts                  # 데이터베이스 액세스
│       └── schema.sql                # 데이터베이스 스키마
├── docker-compose.yml                # Docker Compose 설정
├── Dockerfile                        # Docker 이미지 빌드
├── package.json                      # 의존성 관리
├── tsconfig.json                     # TypeScript 설정
└── next.config.ts                    # Next.js 설정
```

## 🚀 시작하기

### 사전 요구사항

- Node.js >= 18
- PostgreSQL >= 14
- GitHub OAuth App 등록 (Client ID, Secret)
- Docker (선택사항)

### 로컬 개발 환경 설정

#### 1. 저장소 클론

```bash
git clone https://github.com/SBHTDog/sbht-bastion.git
cd sbht-bastion
```

#### 2. 의존성 설치

```bash
npm install
```

#### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=bastion_db

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Application URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# Cookie Security (development: false, production: true)
COOKIE_SECURE=false
```

#### 4. 데이터베이스 설정

PostgreSQL에서 데이터베이스 생성:

```sql
CREATE DATABASE bastion_db;
```

스키마 적용:

```bash
psql -U your_username -d bastion_db -f src/db/schema.sql
```

#### 5. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### Docker로 실행

#### Docker Compose 사용

```bash
# 이미지 빌드 및 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

## 📝 API 엔드포인트

### 인증 라우트

#### `GET /auth/github/login`

GitHub OAuth 로그인 페이지로 리다이렉트

#### `GET /auth/github/callback?code={code}`

GitHub OAuth 콜백 처리 및 세션 생성

**Query Parameters:**

- `code`: GitHub OAuth 인증 코드

**Response:**

- 성공: 대시보드로 리다이렉트
- 실패: 에러 페이지

#### `GET /auth/github/logout`

세션 종료 및 홈페이지로 리다이렉트

### Webhook 라우트

#### `POST /api/webhooks/github`

GitHub webhook 이벤트 수신

**Request Body:**

```json
{
  // GitHub webhook payload (JSON)
}
```

**Response:**

```json
{
  "success": true,
  "recordId": 123,
  "timestamp": "2025-11-21T12:00:00Z"
}
```

#### `GET /api/webhooks/events`

실시간 webhook 이벤트 스트림 (SSE)

**Response:** `text/event-stream`

```
data: {"type":"connected","message":"Connected","timestamp":"..."}

data: {"type":"webhook","event":"push","payload":{...}}

data: {"type":"heartbeat","timestamp":"..."}
```

### 대시보드 라우트

#### `GET /dashboard/github`

사용자 대시보드 (인증 필요)

**Features:**

- 사용자 프로필 정보
- 저장소 목록
- 로그아웃 버튼

## 🔧 설정

### GitHub OAuth App 설정

1. GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App 생성
3. 설정 값:
   - **Application name**: sbht-bastion
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Client ID와 Client Secret을 `.env.local`에 추가

### GitHub Webhook 설정

1. GitHub 저장소 → Settings → Webhooks
2. Add webhook 클릭
3. 설정 값:
   - **Payload URL**: `https://your-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: (선택사항)
   - **Events**: 수신하려는 이벤트 선택
4. Add webhook 클릭

## 📊 데이터베이스 스키마

### `github_webhooks` 테이블

```sql
CREATE TABLE github_webhooks (
    id SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_github_webhooks_created_at ON github_webhooks(created_at);
CREATE INDEX idx_github_webhooks_payload ON github_webhooks USING GIN(payload);
```

**컬럼 설명:**

- `id`: 기본 키 (자동 증가)
- `payload`: GitHub webhook 페이로드 (JSONB)
- `created_at`: 생성 시간 (타임존 포함)

## 🔒 보안 고려사항

### 구현된 보안 기능

1. **환경 변수**: 민감한 정보는 환경 변수로 관리
2. **HTTPS**: 프로덕션에서는 HTTPS 필수
3. **쿠키 보안**:
   - HttpOnly 플래그
   - Secure 플래그 (HTTPS 환경)
   - SameSite 속성
4. **세션 관리**:
   - 암호화된 세션 ID
   - 만료 시간 설정

### 권장 사항

- GitHub Secret을 사용하여 webhook 서명 검증
- Rate limiting 구현
- CORS 정책 설정
- 입력 유효성 검사 강화

## 🧪 테스트

### 로컬 Webhook 테스트

ngrok을 사용하여 로컬 환경에서 webhook 테스트:

```bash
# ngrok 설치 및 실행
ngrok http 3000

# GitHub webhook URL에 ngrok URL 설정
# https://xxxx.ngrok.io/api/webhooks/github
```

## 🚢 배포

### Docker 이미지 빌드

```bash
docker build -t sbht-bastion:latest .
```

### 환경 변수

프로덕션 환경에서 필요한 환경 변수:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `COOKIE_SECURE=true`

## 🤝 기여

이 프로젝트는 Softbank Hackerthon 2025를 위한 것입니다.

## 📄 라이선스

Softbank Hackerthon 2025 이벤트용 프로젝트

</details>

<details>
<summary><strong>🇯🇵 日本語</strong></summary>

## 📋 プロジェクト概要

**sbht-bastion**は、デプロイメント管理と GitHub 統合を担当する管理サービスです。GitHub OAuth による認証、Webhook イベント受信、リアルタイムモニタリング機能を提供し、開発ワークフローを管理します。

このプロジェクトは、Softbank Hackerthon 2025 のための SBHTDog 組織の Bastion サービスリポジトリです。

## ✨ 主な機能

### 🔐 GitHub OAuth 認証

- **安全なログイン**: GitHub OAuth 2.0 によるユーザー認証
- **セッション管理**: Cookie ベースのセッション管理
- **権限制御**: ユーザープロファイルとリポジトリアクセス権限

### 📊 ダッシュボード

- **ユーザープロファイル**: GitHub ユーザー情報表示
  - アバター、名前、会社、場所
  - フォロワー/フォロイング数
  - 公開リポジトリ数
- **リポジトリリスト**: ユーザーの全リポジトリ表示
  - リポジトリ名、説明、言語
  - スター数、フォーク数
  - 最終更新時間

### 📡 GitHub Webhook 受信

- **リアルタイムイベント受信**: GitHub リポジトリのすべてのイベントを受信
- **データベース保存**: PostgreSQL に webhook ペイロードを保存
- **イベントタイプ**:
  - Push イベント
  - Pull Request
  - Issues
  - Release
  - その他すべての GitHub イベント

### 🔴 リアルタイムモニタリング

- **Server-Sent Events (SSE)**: リアルタイムイベントストリーミング
- **Webhook モニターページ**:
  - リアルタイム webhook イベント表示
  - 接続状態モニタリング
  - ハートビート機能
- **自動再接続**: 接続切断時の自動再接続

### 💾 データ管理

- **PostgreSQL 統合**:
  - Webhook イベント永続保存
  - JSONB タイプによる柔軟なクエリサポート
  - 作成時間インデックス
- **イベントエミッター**:
  - メモリベースのイベント発行
  - マルチクライアント対応

## 🛠️ 技術スタック

### フロントエンド

- **Next.js 16.0.3**: React ベースのフルスタックフレームワーク (App Router)
- **React 19.2.0**: UI コンポーネントライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: ユーティリティベース CSS フレームワーク

### バックエンド

- **Next.js API Routes**: サーバーレス API エンドポイント
- **Octokit (@octokit/rest)**: GitHub API クライアント
- **@octokit/auth-oauth-app**: OAuth 認証ライブラリ
- **pg**: PostgreSQL クライアント

### データベース

- **PostgreSQL**: リレーショナルデータベース
  - JSONB タイプで webhook ペイロードを保存
  - GIN インデックスで高速 JSONB クエリ

### DevOps

- **Docker**: コンテナ化
- **Docker Compose**: ローカル開発環境

## 📂 プロジェクト構造

```
sbht-bastion/
├── app/
│   ├── api/
│   │   ├── github/
│   │   │   └── route.ts              # GitHub APIプロキシ
│   │   └── webhooks/
│   │       ├── github/
│   │       │   └── route.ts          # Webhook受信エンドポイント
│   │       └── events/
│   │           └── route.ts          # SSEイベントストリーム
│   ├── auth/
│   │   └── github/
│   │       ├── login/
│   │       │   └── route.ts          # OAuthログイン開始
│   │       ├── callback/
│   │       │   └── route.ts          # OAuthコールバック処理
│   │       └── logout/
│   │           └── route.ts          # ログアウト
│   ├── dashboard/
│   │   └── github/
│   │       ├── page.tsx              # ダッシュボードページ
│   │       ├── actions.ts            # サーバーアクション
│   │       └── LogoutButton.tsx      # ログアウトボタン
│   ├── webhooks/
│   │   └── monitor/
│   │       └── page.tsx              # リアルタイムモニタリングページ
│   ├── layout.tsx                    # ルートレイアウト
│   ├── page.tsx                      # ホームページ
│   └── globals.css                   # グローバルスタイル
├── src/
│   ├── github/
│   │   ├── ghacc.ts                  # GitHub認証ユーティリティ
│   │   └── webhook-emitter.ts       # Webhookイベントエミッター
│   └── db/
│       ├── dbacc.ts                  # データベースアクセス
│       └── schema.sql                # データベーススキーマ
├── docker-compose.yml                # Docker Compose設定
├── Dockerfile                        # Dockerイメージビルド
├── package.json                      # 依存関係管理
├── tsconfig.json                     # TypeScript設定
└── next.config.ts                    # Next.js設定
```

## 🚀 はじめに

### 前提条件

- Node.js >= 18
- PostgreSQL >= 14
- GitHub OAuth App 登録 (Client ID, Secret)
- Docker (オプション)

### ローカル開発環境のセットアップ

#### 1. リポジトリのクローン

```bash
git clone https://github.com/SBHTDog/sbht-bastion.git
cd sbht-bastion
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の内容を入力:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=bastion_db

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Application URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# Cookie Security (development: false, production: true)
COOKIE_SECURE=false
```

#### 4. データベースのセットアップ

PostgreSQL でデータベースを作成:

```sql
CREATE DATABASE bastion_db;
```

スキーマの適用:

```bash
psql -U your_username -d bastion_db -f src/db/schema.sql
```

#### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000`にアクセス

### Docker で実行

#### Docker Compose を使用

```bash
# イメージビルドとコンテナ起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 停止
docker-compose down
```

## 📝 API エンドポイント

### 認証ルート

#### `GET /auth/github/login`

GitHub OAuth ログインページへリダイレクト

#### `GET /auth/github/callback?code={code}`

GitHub OAuth コールバック処理とセッション作成

**Query Parameters:**

- `code`: GitHub OAuth 認証コード

**Response:**

- 成功: ダッシュボードへリダイレクト
- 失敗: エラーページ

#### `GET /auth/github/logout`

セッション終了とホームページへリダイレクト

### Webhook ルート

#### `POST /api/webhooks/github`

GitHub webhook イベント受信

**Request Body:**

```json
{
  // GitHub webhook payload (JSON)
}
```

**Response:**

```json
{
  "success": true,
  "recordId": 123,
  "timestamp": "2025-11-21T12:00:00Z"
}
```

#### `GET /api/webhooks/events`

リアルタイム webhook イベントストリーム (SSE)

**Response:** `text/event-stream`

```
data: {"type":"connected","message":"Connected","timestamp":"..."}

data: {"type":"webhook","event":"push","payload":{...}}

data: {"type":"heartbeat","timestamp":"..."}
```

### ダッシュボードルート

#### `GET /dashboard/github`

ユーザーダッシュボード (認証必要)

**Features:**

- ユーザープロファイル情報
- リポジトリリスト
- ログアウトボタン

## 🔧 設定

### GitHub OAuth App の設定

1. GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App を作成
3. 設定値:
   - **Application name**: sbht-bastion
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Client ID と Client Secret を`.env.local`に追加

### GitHub Webhook の設定

1. GitHub リポジトリ → Settings → Webhooks
2. Add webhook をクリック
3. 設定値:
   - **Payload URL**: `https://your-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: (オプション)
   - **Events**: 受信したいイベントを選択
4. Add webhook をクリック

## 📊 データベーススキーマ

### `github_webhooks` テーブル

```sql
CREATE TABLE github_webhooks (
    id SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_github_webhooks_created_at ON github_webhooks(created_at);
CREATE INDEX idx_github_webhooks_payload ON github_webhooks USING GIN(payload);
```

**カラム説明:**

- `id`: プライマリキー (自動インクリメント)
- `payload`: GitHub webhook ペイロード (JSONB)
- `created_at`: 作成時刻 (タイムゾーン付き)

## 🔒 セキュリティ考慮事項

### 実装されたセキュリティ機能

1. **環境変数**: 機密情報は環境変数で管理
2. **HTTPS**: 本番環境では HTTPS 必須
3. **Cookie セキュリティ**:
   - HttpOnly フラグ
   - Secure フラグ (HTTPS 環境)
   - SameSite 属性
4. **セッション管理**:
   - 暗号化されたセッション ID
   - 有効期限設定

### 推奨事項

- GitHub Secret を使用して webhook 署名検証
- Rate limiting 実装
- CORS ポリシー設定
- 入力検証の強化

## 🧪 テスト

### ローカル Webhook テスト

ngrok を使用してローカル環境で webhook をテスト:

```bash
# ngrokのインストールと実行
ngrok http 3000

# GitHub webhook URLにngrok URLを設定
# https://xxxx.ngrok.io/api/webhooks/github
```

## 🚢 デプロイ

### Docker イメージのビルド

```bash
docker build -t sbht-bastion:latest .
```

### 環境変数

本番環境で必要な環境変数:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `COOKIE_SECURE=true`

## 🤝 コントリビューション

このプロジェクトは、Softbank Hackerthon 2025 のためのものです。

## 📄 ライセンス

Softbank Hackerthon 2025 イベント用プロジェクト

</details>
