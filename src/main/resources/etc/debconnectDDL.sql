USE devconnect;

-- 개발자 테이블 샘플 데이터 10개
INSERT INTO developer( did, dpwd, dname, dphone, daddress, demail, dprofile, dlevel, dcurrentexp, dtotalexp, create_at, update_at )
VALUES
( 'ppo3703', 'gmlaks4992', '박희만', '010-9275-6333', '인천시 미추홀구 도화동', 'pp4992@naver.com', 'default.jpg', 2, 100, 200, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'magnoria', 'tkdqja123', '한상범', '010-4837-3844', '인천시 부평구 청천동', 'magnoria@gmail.com', 'default.jpg', 5, 250, 500, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'riwonsys', 'fldnjs123', '김리원', '010-2482-4492', '인천시 부평구 부개1동', 'riwonsys@gmail.com', 'default.jpg', 3, 50, 300, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'hanu1229', 'dndwo123', '한웅재', '010-4640-7877', '인천시 연수구 연수1동', 'hanu1229@gmail.com', 'default.jpg', 2, 0, 200, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'sunghyun98', 'pass1234', '이성현', '010-8823-3345', '서울특별시 강남구 삼성동', 'sunghyun98@gmail.com', 'default.jpg', 3, 150, 300, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'choihyejin', 'pwd4567', '최혜진', '010-2323-8888', '경기도 수원시 팔달구', 'choihyejin@naver.com', 'default.jpg', 4, 200, 400, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'jiminpark', 'securepw1', '박지민', '010-9344-5566', '대전광역시 유성구 궁동', 'jimin.park@daum.net', 'default.jpg', 1, 50, 100, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'taehwan', 'tiger998', '김태환', '010-6743-2211', '광주광역시 서구 쌍촌동', 'taehwan@kakao.com', 'default.jpg', 2, 90, 180, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'leesunwoo', 'leelee22', '이선우', '010-3939-2929', '부산광역시 해운대구 우동', 'sunwoo.lee@gmail.com', 'default.jpg', 3, 130, 260, '2024-04-01 10:00:00', '2024-04-01 10:00:00' ),
( 'qwe123', 'qwe123', '테스트', '010-7777-8888', '울산광역시 남구 무거동', 'jangminho@outlook.com', 'default.jpg', 5, 300, 600, '2024-04-01 10:00:00', '2024-04-01 10:00:00' );

-- 기업 테이블 샘플 데이터 10개
insert into company( cid, cpwd, cname, cphone, cadress, cemail, cbusiness, cprofile)
values( 'cmd1' , 'a1234' , '크래프트(주)' , '02-2323-5343' , '서울 금천구 가산디지털1로 99' ,'craft@naver.com', '214-88-13306' , 'profil1.jpg')
,( 'cmd2' , 'b1234' , '이랑(주)' , '02-5345-2342' , '서울특별시 금천구 가산디지털2로 127-20' ,'irang@naver.com', '134-87-11626' , 'profil2.jpg')
,( 'cmd3' , 'c1234' , '파르티(주)' , '02-2344-2342' , '서울특별시 금천구 디지털로10길 9' ,'partia@naver.com', '312-33-14797' , 'profil3.jpg')
,( 'cmd4' , 'd1234' , '나르티아엔터' , '02-3653-3544' , '가산동 60-8' ,'nartia@naver.com', '398-21-01288' , 'profil4.jpg');


-- 기업 평가 테이블 샘플 데이터 10개
insert into crating( crscore , crdate , dno , cno )values
( 100 , "2025-04-18" , 1 , 1 ),
( 30 , "2025-04-18" , 2 , 2 ),
( 50 , "2025-04-18" , 3 , 3 ),
( 80 , "2025-04-18" , 4 , 4 ),
( 55 , "2025-04-18" , 5 , 5 ),
( 0 , "2025-04-18" , 6 , 6 ),
( 70 , "2025-04-18" , 7 , 7 ),
( 75 , "2025-04-18" , 8 , 8 ),
( 18 , "2025-04-18" , 9 , 9 ),
( 100 , "2025-04-18" , 10 , 10 );

-- 개발자 평가 테이블 샘플 데이터 10개
insert into drating( drscore , drdate , pno , dno )values
( 70 , "2025-04-18" , 1 , 1 ),
( 75 , "2025-04-18" , 2 , 2 ),
( 45 , "2025-04-18" , 3 , 3 ),
( 90 , "2025-04-18" , 4 , 4 ),
( 0 , "2025-04-18" , 5 , 5 ),
( 30 , "2025-04-18" , 6 , 6 ),
( 25 , "2025-04-18" , 7 , 7 ),
( 0 , "2025-04-18" , 8 , 8 ),
( 95 , "2025-04-18" , 9 , 9 ),
( 100 , "2025-04-18" , 10 , 10 );

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