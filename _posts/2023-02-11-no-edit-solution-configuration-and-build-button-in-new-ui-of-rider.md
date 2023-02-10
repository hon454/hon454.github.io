---
title: Rider의 신규 UI에서 'Edit Solution Configuration'이 보이지 않는 경우 해결법.
date: 2023-02-11 16:06:00 +0900
categories: [Jetbrains, Rider]
tags: [unreal, jetbrains, rider, tip]
typora-root-url: ./..
---

![image-20230211032515154](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211032515154.png)

Rider가  2022.2.3부터 인가 신규 UI를 사용할 수 있는 옵션이 생겼다. 해당 옵션을 사용하면 마치 Rider가 VS Code 처럼 디자인이 변경된다. 처음에는 텍스트 에디터 같은 약간 가벼워 보이는 인상이었지만 사용하다 보니 UI들이 아이콘 위주로 배치되고 큼직큼직하게 변경 되어서 좀 더 눈에 띄게 변경된 것 같다.



![image-20230211033257234](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211033257234.png)_기존 Rdier_



![image-20230211033025369](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211033025369.png)_새로운 UI가 적용된 Rider_



![image-20230211033748120](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211033748120.png)

![image-20230211033806603](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211033806603.png)

그런데 문제는 신규 UI에서는 `Edit Configurations` 창을 열어서 `Solution Configuration`을 변경해도 변경이 되지 않는 문제가 있다. 



![image-20230211033420252](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211033420252.png)

그리고 위와 같이 기존 UI에서 존재하던 Edit Soulution Configurations 툴 바 메뉴가 사라졌다... `Solution Configuration`을 변경하지 못하는 것은 개발에 영향을 주기 때문에 신규 UI를 사용하려면 반드시 해당 기능을 복구할 필요가 있었다.



![image-20230211034324896](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211034324896.png)

![image-20230211034612240](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211034612240.png)

검색을 통해 해결 방법을 찾아보니 우측 상단의 툴바를 우클릭 후 `Customize Toolbar..`를 클릭한 뒤 위와 같이 `ExecutionTargetsToolbarGroup`에 `ActiveConfiguration` 액션을 추가해주면 된다.



![image-20230211034752528](/assets/img/2023-02-11-no-edit-solution-configuration-and-build-button-in-new-ui-of-rider/image-20230211034752528.png)

그러면 기존 UI 처럼 `Solution Configurations` 변경 메뉴가 다시 생긴 것을 볼 수 있다.



## 참고 자료

[No `Edit Solution Configuration` and `Build` button in new UI](https://youtrack.jetbrains.com/issue/RIDER-83004/No-Edit-Solution-Configuration-and-Build-button-in-new-UI)
