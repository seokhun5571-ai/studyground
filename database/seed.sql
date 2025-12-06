-- 초기 데이터 설정

-- 관리자 계정 생성 (username: admin, password: admin1234)
-- 비밀번호는 bcrypt로 해시된 값입니다
INSERT INTO admins (username, password_hash, name, email, role)
VALUES (
  'admin',
  '$2b$10$YQOnL.u8KqP9ufG3K5g7/.rJ8YQvF0YfXJWQVvKxvL.xKqmzWQqRy',
  '관리자',
  'admin@studyground.com',
  'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- 좌석 초기 데이터 (30개 좌석)
INSERT INTO seats (seat_number, seat_type, is_available, status)
SELECT generate_series(1, 30), 'standard', true, 'available'
ON CONFLICT (seat_number) DO NOTHING;

-- 테스트 학생 데이터
INSERT INTO students (name, student_number, pin, phone, grade, status)
VALUES 
  ('김철수', '2024001', '1234', '010-1234-5678', '고3', 'active'),
  ('이영희', '2024002', '5678', '010-2345-6789', '고3', 'active'),
  ('박민수', '2024003', '9012', '010-3456-7890', '고2', 'active'),
  ('정수진', '2024004', '3456', '010-4567-8901', '고2', 'active'),
  ('최동욱', '2024005', '7890', '010-5678-9012', '고1', 'active')
ON CONFLICT (student_number) DO NOTHING;

-- 테스트 공지사항
INSERT INTO announcements (title, content, priority, is_active, created_by)
VALUES 
  ('스터디그라운드 오픈!', '스터디그라운드에 오신 것을 환영합니다. 열심히 공부하세요!', 'high', true, 1),
  ('내일 휴무 안내', '내일은 공휴일로 휴무입니다.', 'normal', true, 1)
ON CONFLICT DO NOTHING;

-- 학습 목표 설정 (테스트용)
INSERT INTO study_goals (student_id, daily_goal_hours, weekly_goal_hours, monthly_goal_hours)
SELECT id, 480, 3360, 14400 FROM students WHERE student_number = '2024001'
ON CONFLICT DO NOTHING;

-- 완료 메시지
SELECT '초기 데이터 설정이 완료되었습니다.' as message;
