-- 개발자 테이블 샘플 데이터 10개
INSERT INTO developer( did, dpwd, dname, dphone, daddress, demail, dprofile, dlevel, dcurrentexp, dtotalexp, create_at, update_at )
VALUES
( 'ppo3703', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '박희만', '010-9275-6333', '인천시 미추홀구 도화동', 'pp4992@naver.com', 'default.jpg', 2, 100, 200, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'magnoria', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '한상범', '010-4837-3844', '인천시 부평구 청천동', 'magnoria@gmail.com', 'default.jpg', 5, 250, 500, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'riwonsys', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '김리원', '010-2482-4492', '인천시 부평구 부개1동', 'riwonsys@gmail.com', 'default.jpg', 3, 50, 300, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'hanu1229', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '한웅재', '010-4640-7877', '인천시 연수구 연수1동', 'hanu1229@gmail.com', 'default.jpg', 2, 0, 200, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'sunghyun98', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '이성현', '010-8823-3345', '서울특별시 강남구 삼성동', 'sunghyun98@gmail.com', 'default.jpg', 3, 150, 300, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'choihyejin', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '최혜진', '010-2323-8888', '경기도 수원시 팔달구', 'choihyejin@naver.com', 'default.jpg', 4, 200, 400, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'jiminpark', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '박지민', '010-9344-5566', '대전광역시 유성구 궁동', 'jimin.park@daum.net', 'default.jpg', 1, 50, 100, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'taehwan', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '김태환', '010-6743-2211', '광주광역시 서구 쌍촌동', 'taehwan@kakao.com', 'default.jpg', 2, 90, 180, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'leesunwoo', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '이선우', '010-3939-2929', '부산광역시 해운대구 우동', 'sunwoo.lee@gmail.com', 'default.jpg', 3, 130, 260, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'qwe123', '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a', '테스트', '010-7777-8888', '울산광역시 남구 무거동', 'jangminho@outlook.com', 'default.jpg', 5, 300, 600, '2024-04-01 10:00:00', '2024-04-01 10:00:00' );

-- 기업 테이블 샘플 데이터 10개
insert into company( cid, cpwd, cname, cphone, cadress, cemail, cbusiness, cprofile)
values( 'cmd1' , 'a1234' , '크래프트(주)' , '02-2323-5343' , '서울 금천구 가산디지털1로 99' ,'craft@naver.com', '214-88-13306' , 'profil1.jpg')
,( 'cmd2' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '이랑(주)' , '02-5345-2342' , '서울특별시 금천구 가산디지털2로 127-20' ,'irang@naver.com', '134-87-11626' , 'profil2.jpg')
,( 'cmd3' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '파르티(주)' , '02-2344-2342' , '서울특별시 금천구 디지털로10길 9' ,'partia@naver.com', '312-33-14797' , 'profil3.jpg')
,( 'cmd4' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '나르티아엔터' , '02-3653-3544' , '가산동 60-8' ,'nartia@naver.com', '398-21-01288' , 'profil4.jpg')
,( 'cmd5' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '(주)넥서스테크' , '070-1111-2222' , '경기 성남시 분당구 대왕판교로 712' ,'nexustech@example.com', '123-45-67890' , 'profil5.jpg')
, ( 'cmd6' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '데이터솔루션즈' , '070-3333-4444' , '서울 강남구 역삼로 165' ,'datasolutions@example.com', '987-65-43210' , 'profil6.jpg')
, ( 'cmd7' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '(주)클라우드허브' , '070-5555-6666' , '서울 금천구 가산디지털1로 171' ,'cloudhub@example.com', '112-23-34455' , 'profil7.jpg')
, ( 'cmd8' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , 'AI랩스 코리아' , '070-7777-8888' , '서울 구로구 디지털로 26길 111' ,'ailabskr@example.com', '667-78-89900' , 'profil8.jpg')
, ( 'cmd9' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '(주)시스템게이트' , '070-9999-0000' , '경기 수원시 영통구 광교로 123' ,'systemgate@example.com', '334-45-56677' , 'profil9.jpg')
, ( 'cmd10' , '$2a$10$FlfJ4fQwY9pr5YX.Sw7nBuKB9TXl71m4Bh0Eig.A2ZYlZBmOACk/a' , '이노텍 솔루션' , '070-1212-3434' , '서울 송파구 중대로 234' ,'inotechsol@example.com', '889-90-01122' , 'profil10.jpg');

INSERT INTO project(pname, pintro, ptype, pcomment, pcount, pstart, pend, recruit_pstart, recruit_pend, ppay, cno, create_at, update_at)
VALUES
('쇼핑몰 제작 [백엔드]', 'Spring Boot를 이용한 의류 쇼핑몰 홈페이지 제작', 1, '~~~', 2, '2024-11-11', '2025-03-10', '2024-10-10', '2024-11-10', 2500, 1, '2024-10-10', '2024-10-10'),
('커뮤니티 제작 [백엔드]', 'Spring Boot를 이용한 커뮤니티 홈페이지 제작', 1, '~~~', 2, '2024-11-12', '2025-03-11', '2024-10-11', '2024-11-11', 2500, 2, '2024-10-11', '2024-10-11'),

('자사 ERP 제작 [백엔드]', 'Spring Boot를 이용한 ERP 홈페이지 제작', 1, '~~~', 2, '2025-06-20', '2025-12-19', '2025-04-10', '2025-05-10', 2500, 3, '2025-04-10', '2025-04-10'),
('대학교 홈페이지 리뉴얼 [백엔드]', 'Spring Boot를 이용한 대학교 홈페이지 리뉴얼', 1, '~~~', 2, '2025-06-23', '2025-12-20', '2025-04-12', '2025-05-11', 2500, 4, '2025-04-12', '2025-04-12'),
('대학병원 홈페이지 제작 [백엔드]', 'Spring Boot를 이용한 홈페이지 제작', 1, '~~~', 2, '2025-06-25', '2025-12-21', '2025-04-14', '2025-05-14', 2500, 5, '2025-04-14', '2025-04-14'),

('쇼핑몰 제작 [프론트]', 'React와 Flutter를 이용한 의류 쇼핑몰 홈페이지 제작', 2, '~~~', 1, '2024-11-11', '2025-03-10', '2024-10-10', '2024-11-10', 2000, 1, '2024-10-10', '2024-10-10'),
('커뮤니티 제작 [프론트]', 'React와 Flutter를 이용한 커뮤니티 홈페이지 제작', 2, '~~~', 1, '2024-11-12', '2025-03-11', '2024-10-11', '2024-11-11', 2000, 2, '2024-10-11', '2024-10-11'),

('자사 ERP 제작 [프론트]', 'React와 Flutter를 이용한 ERP 홈페이지 제작', 2, '~~~', 1, '2025-06-20', '2025-12-19', '2025-04-10', '2025-05-10', 2000, 3, '2025-04-10', '2025-04-10'),
('대학교 홈페이지 리뉴얼 [프론트]', 'React와 Flutter를 이용한 대학교 홈페이지 리뉴얼', 2, '~~~', 1, '2025-06-23', '2025-12-20', '2025-04-12', '2025-05-11', 2000, 4, '2025-04-12', '2025-04-12'),
('대학병원 홈페이지 제작 [프론트]', 'React와 Flutter를 이용한 홈페이지 제작', 2, '~~~', 1, '2025-06-25', '2025-12-21','2025-04-14', '2025-05-14', 2000, 5, '2025-04-14', '2025-04-14');

INSERT INTO project_join(pjtype, pjtime, pno, dno, create_at, update_at)
VALUES
(1, '2024-10-15 15:30', 1, 1, '2024-10-15 15:30', '2024-10-15 15:30'),
(1, '2024-10-16 12:20', 2, 2, '2024-10-16 12:20', '2024-10-16 12:20'),
(0, '2025-04-15 10:15', 3, 3, '2025-04-15 10:15', '2025-04-15 10:15'),
(0, '2025-04-17 11:17', 4, 4, '2025-04-17 11:17', '2025-04-17 11:17'),
(0, '2025-04-20 18:12', 5, 5, '2025-04-20 18:12', '2025-04-20 18:12'),
(1, '2024-10-15 15:30', 6, 6, '2024-10-15 15:30', '2024-10-15 15:30'),
(1, '2024-10-16 12:20', 7, 7, '2024-10-16 12:20', '2024-10-16 12:20'),
(0, '2025-04-15 20:52', 8, 8, '2025-04-15 20:52', '2025-04-15 20:52'),
(0, '2025-04-17 21:15', 9, 9, '2025-04-17 21:15', '2025-04-17 21:15'),
(0, '2025-04-20 17:35', 10, 10, '2025-04-20 17:35', '2025-04-20 17:35');

-- 기업 평가 테이블 샘플 데이터 10개
insert into crating( crscore , create_at , update_at , crstate , dno , pno )values
( 100 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 1 , 1 ),
( 30 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 2 , 2 ),
( 50 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 3 , 3 ),
( 80 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 4 , 4 ),
( 55 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 5 , 5 ),
( 0 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 6 , 6 ),
( 70 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 7 , 7 ),
( 75 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 8 , 8 ),
( 18 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 9 , 9 ),
( 100 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 10 , 10 );

-- 개발자 평가 테이블 샘플 데이터 10개
insert into drating( drscore , create_at , update_at , drstate , pno , dno )values
( 70 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 1 , 1 ),
( 75 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 2 , 2 ),
( 45 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 3 , 3 ),
( 90 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 4 , 4 ),
( 0 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 5 , 5 ),
( 30 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 6 , 6 ),
( 25 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 7 , 7 ),
( 0 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 8 , 8 ),
( 95 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 9 , 9 ),
( 100 , "2025-03-18 17:30" , "2025-04-22 19:30" , 1 , 10 , 10 );

-- 관리자 샘플 데이터 등록 | rw 25-04-19 샘플생성
-- 로그인 테스트 시 adpwd = qwe1234로 입력
INSERT INTO admin (adid, adpwd, adname, adphone)
VALUES
('admin01', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자1', '010-1234-1111'),
  ('admin02', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자2', '010-1234-2222'),
  ('admin03', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자3', '010-1234-3333'),
  ('admin04', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자4', '010-1234-4444'),
  ('admin05', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자5', '010-1234-5555'),
  ('admin06', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자6', '010-1234-6666'),
  ('admin07', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자7', '010-1234-7777'),
  ('admin08', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자8', '010-1234-8888'),
  ('admin09', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자9', '010-1234-9999'),
  ('admin10', '$2a$10$KbQi5XQ5uAxJ1w6Qj8EDeuX7MZyrEtAOu0YaMpIoFthI4FFl3kWT6', '리원관리자10', '010-1234-1010');