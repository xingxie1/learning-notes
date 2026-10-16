---
title: "从零开始算法入门——1STL"
date: 2026-09-30 23:05:00
published: false
categories:
  - 学习笔记
tags:
  - 算法
description: "算法基础"
cover: /img/card-cover.svg
katex: true
---

# 为什么要学STL

# 从c语言过渡到c++

## 1. 头文件

```cpp

#include<bits/stdc++.h> 
using namespace std;
```

这两句可以说是cpp写算法题的万能模板了，第一句是包含头文件，这个头文件包含了在写算法时可能用到的所有函数，有了它，我们平时写算法题时就不用再包含一大堆头文件了。需要注意的是，这个头文件只有gcc编译器才有，clang等其他编译器是没有的，另外这个头文件只建议在写算法题时用，如果是写工程项目不建议用。
第二句的意思是展开命名空间(这个只做了解即可)，cpp为了防止命名冲突，会把一些函数的定义和声明放在命名空间中,在使用命名空间中的函数时，需要指定命名空间，例如 `std::cin >> x;`，而如果展开了命名空间就可以省掉`std::`。同样的展开命名空间只建议在写算法题时用，如果是写工程项目不建议用。

## 2. 输入输出

```cpp

    int x;
    scanf("%d",&x);//c语言
    cin >> x;//c++

    printf("%d",x);//c语言
    cout << x;//c++
```

需要注意的是，cin 和 cout 比 scanf 和 printf 慢，所以一般在使用时会在main函数的开头加两句话
`ios::sync_with_stdio(false)`
`cin.tie(nullptr);`
加上这两句后，cin 和 cout 和 scanf 和 printf 几乎一样快了。

写算法题的通用模板

```cpp
#include<bits/stdc++.h>
using namespace std;

void solve()
{
    
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    solve();

    return 0;
}

```

# STL是什么

## 1. vector
