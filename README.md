# 서울 전시 노트

Supabase의 `exhibition_recommendations` 테이블을 읽어 최신 추천과 지난 추천을 보여주는 Next.js App Router 애플리케이션입니다.

## 로컬 실행

Windows에서 pnpm이 설치되어 있지 않아도 프로젝트 폴더에서 아래 명령으로 실행할 수 있습니다.

```cmd
start-local.cmd
```

터미널에 표시되는 주소(일반적으로 `http://localhost:3000`)를 브라우저에서 엽니다. 이미 설치된 pnpm을 사용하려면 `pnpm dev`를 실행해도 됩니다.

## 필요한 Supabase 정책

브라우저에는 저장용 `INGEST_API_KEY`나 service-role key를 노출하지 않습니다. 앱은 서버 컴포넌트에서 읽기만 수행하므로 `exhibition_recommendations`에 익명 읽기 정책이 필요합니다.

Supabase SQL Editor에서 [`supabase/public-read-policy.sql`](./supabase/public-read-policy.sql)을 한 번 실행합니다.

데이터가 비공개여야 한다면 위 정책 대신 Supabase Auth를 추가하세요.
