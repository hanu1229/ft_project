# 프로젝트 기반 프리랜서 개발자 중개 플랫폼 

# 🎥 프로젝트 시연영상

[프로젝트 시연영상 링크](https://youtu.be/wbu8Rfeoq30)
<br/>
[프로젝트 PPT]https://www.canva.com/design/DAGm7UhNL1Q/J-85BA3XQeJ8cKC9Ggf1mw/edit?utm_content=DAGm7UhNL1Q&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton


## 👨‍🏫 프로젝트 소개
"재활용 미션 랭킹을 통한 환경 보호 챌린지 프로그램"을 주제로 한 동적 웹페이지입니다. 재활용 미션에 함께 참여하여 지역별 커뮤니티를 활성화하고 환경 보호 챌린지를 독려하기 위해 포인트 랭킹을 보여주는 플랫폼을 제작해보았습니다.




## ⏱ 개발기간
- 2025.02.03(월) ~ 2025.02.20(목)
- 기획서 / REST API 명세서 작성
- 발표평가




## 🙋‍♂️ 개발자 소개

<table>
  <tbody>
    <tr>
     <td align="center"><a href="https://github.com/PHM-dung2"><img src="" width="100px;"  alt=""/><br /><sub><b>박희만  </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/Ryuyena0305"><img src="" width="100px;" alt="" /><br /><sub><b> 류예나 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/ithodol"><img src="" width="100px;" alt=""/><br /><sub><b> 전은서 </b></sub></a><br /></td>
     <tr/>
  </tbody>
</table>


💡 박희만 : 조장, 공통 JSP/인터페이스 배포, 챌린지 게시판 개발

💡 류예나 : 캔바, 관리자 계정 관리 서비스 개발, 챌린지 게시판 지역별 출력

💡 전은서 : GIT 담당, 챌린지 참여자 포인트 배포, 사용자 계정 관리 서비스 개발




## 💻 개발환경
- **Version** : Java 17
- **IDE** : ![Eclipse IDE](https://img.shields.io/badge/Eclipse%20IDE-2C2255.svg?&style=for-the-badge&logo=Eclipse%20IDE&logoColor=white)
- **BackEnd** : ![Java](https://img.shields.io/badge/Java-007396.svg?&style=for-the-badge&logo=Java&logoColor=white) 
- **FrontEnd** :  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> 
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
- **협업도구** : <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">



## ⚙️ 기술 스택
- **DataBase** : <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 
- **server** : Apache Tomcat
- **기획서 작성** : Google Sheets
- **일정 관리** : Jira




## 📌 주요 기능
- **챌린지 등록**
  - 챌린지 제목, 내용, 인원수, 시작날짜, 종료날짜 입력 후 kakao API로 구현된 지도에서 장소를 검색 후 마커를 선택하여 위도 경도를 입력한다.
  - Json으로 DB에 입력한다.


    
- **챌린지 지도 검색**
  - kakao API로 구현된 지도에서 클러스터로 지역별로 등록된 챌린지가 표현된다.
  - 클러스터를 누르면 지역이 확대되어 마커로 보여준다.
  - 마커를 클릭하면 해당 챌린지 게시물로 이동한다.


    
- **유저 랭킹 조회**
  - 포인트가 높은 상위 10명의 유저를 표시한다.
  - TOP3의 유저들은 닉네임 옆에 등수별로 이미지를 보여준다.
    


 
## ✒️ API
- **API 명세서** : [API명세서 링크](https://docs.google.com/spreadsheets/d/10N5DFd7VoDViOcDsw-X1zcQP-eSt3jQMj933DkEu8SQ/edit?gid=1012366780#gid=1012366780)
