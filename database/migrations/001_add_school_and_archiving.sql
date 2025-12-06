-- 학생 테이블에 학교 정보와 아카이빙 필드 추가
-- 기존 데이터베이스에 적용할 마이그레이션

-- 학교 정보 컬럼 추가
ALTER TABLE students ADD COLUMN school VARCHAR(100);

-- 아카이빙 정보 컬럼 추가
ALTER TABLE students ADD COLUMN archived_at DATETIME;

-- 좌석 수를 35개로 확장 (기존 30개에서 5개 추가)
INSERT INTO seats (seat_number, seat_type, pin, is_available, status) 
SELECT 
  printf('%02d', seat_num) as seat_number,
  'standard' as seat_type,
  (1000 + seat_num) as pin,
  1 as is_available,
  'available' as status
FROM (
  SELECT 31 as seat_num UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35
) new_seats
WHERE NOT EXISTS (
  SELECT 1 FROM seats WHERE seat_number = printf('%02d', new_seats.seat_num)
);

