##Q6. `exec` 跟 `source` 差在哪？

這次先讓我們從 CU Shell 版的一個實例貼子來談起吧：
(論壇改版後原連結已經失效 )

例中的提問原文如下：

> `cd /etc/aa/bb/cc`可以執行   
> 但是把這條命令寫入shell時shell不執行！   
> 這是什么原因呀！
>  
>（意思是：運行腳本後并沒有移到 `/etc/aa/bb/cc` 目錄）

我當時如何回答暫時別去深究，先讓我們了解一下行程(process)的觀念好了。  
首先，我們所執行的任何程式，都是由父行程(parent process)所產生出來的一個子行程(child process)，
子行程在結束後，將返回到父行程去。此一現像在 Linux 系統中被稱為 `fork` 。  
(為何要程為 `fork` 呢？嗯，畫一下圖或許比較好理解...  ^_^ )  
當子行程被產生的時候，將會從父行程那裡獲得一定的資源分配、及(更重要的是)繼承父行程的環境﹗  
讓我們回到上一章所談到的"環境變量"吧：

> 所謂環境變量其實就是那些會傳給子行程的變量。

簡單而言，"遺傳性"就是區分本地變量與環境變量的決定性指標。  
然而，從遺傳的角度來看，我們也不難發現環境變量的另一個重要特徵：

> 環境變量只能從父行程到子行程單向繼承。換句話說：在子行程中的環境如何變更，均不會影響父行程的環境。

接下來，再讓我們了解一下命令腳本(shell script)的概念。  
所謂的 shell script 講起來很簡單，就是將你平時在 shell prompt 後所輸入的多行 command line 依序寫入一個文件去而已。  
其中再加上一些條件判斷、互動界面、參數運用、函數調用等等技巧，得以讓 script 更加"聰明"的執行，
但若撇開這些技巧不談，我們真的可以簡單的看成 script 只不過依次執行預先寫好的命令行而已。

再結合以上兩個概念(process + script)，那應該就不難理解如下這句話的意思了：

> 正常來說，當我們執行一個 shell script 時，其實是先產生一個 sub-shell 的子行程，然後 sub-shell 再去產生命令行的子行程。

然則，那讓我們回到本章開始時所提到的例子再從新思考：

> `cd /etc/aa/bb/cc`可以執行   
> 但是把這條命令寫入shell時shell不執行！   
> 這是什么原因呀！

我當時的答案是這樣的：

> 因為，一般我們跑的 shell script 是用 subshell 去執行的。   
> 從 process 的觀念來看，是 parent process 產生一個 child process 去執行，   
> 當 child 結束後，會返回 parent ，但 parent 的環境是不會因 child 的改變而改變的。  
> 所謂的環境元數很多，凡舉 effective id, variable, workding dir 等等...   
> 其中的 workding dir (`$PWD`) 正是樓主的疑問所在：  
> 當用 subshell 來跑 script 的話，sub shell 的 `$PWD` 會因為 `cd` 而變更，   
> 但當返回 primary shell 時，`$PWD` 是不會變更的。  

能夠了解問題的原因及其原理是很好的，但是？如何解決問題恐怕是我們更感興趣的﹗是吧？^_^  
那好，接下來，再讓我們了解一下 source 命令好了。  
當你有了 `fork` 的概念之後，要理解 source 就不難：

> 所謂 source 就是讓 script 在當前 shell 內執行、而不是產生一個 sub-shell 來執行。

由於所有執行結果均於當前 shell 內完成，若 script 的環境有所改變，當然也會改變當前環境了﹗  
因此，只要我們將原本單獨輸入的 script 命令行變成 source 命令的參數，就可輕易解決前例提到的問題了。  
比方說，原本我們是如此執行  script 的：
    
    ./my.script

現在改成這樣即可：
    
    source ./my.script
    或：
    . ./my.script

說到這裡，我想，各位有興趣看看 `/etc` 底下的眾多設定文件，
應該不難理解它們被定議後，如何讓其他 script 讀取並繼承了吧？  
若然，日後你有機會寫自己的 script ，應也不難專門指定一個設定文件以供不同的 script 一起"共用"了...  ^_^  

okay，到這裡，若你搞得懂 `fork` 與 `source` 的不同，那接下來再接受一個挑戰：    
---- 那 `exec` 又與 `source/fork` 有何不同呢？  
哦... 要了解 exec 或許較為複雜，尤其扯上 File Descriptor 的話...  
不過，簡單來說：

> `exec` 也是讓 script 在同一個行程上執行，但是原有行程則被結束了。

也就是簡而言之：原有行程會否終止，就是 `exec` 與 `source/fork` 的最大差異了。

嗯，光是從理論去理解，或許沒那麼好消化，不如動手"實作+思考"來的印象深刻哦。  
下面讓我們寫兩個簡單的 script ，分別命名為 `1.sh` 及 `2.sh` ：

    1.sh 

    #!/bin/bash 
    A=B 
    echo "PID for 1.sh before exec/source/fork:$$"
    export A
    echo "1.sh: \$A is $A"
    case $1 in
            exec)
                    echo "using exec..."
                    exec ./2.sh ;;
            source)
                    echo "using source..."
                    . ./2.sh ;;
            *)
                    echo "using fork by default..."
                    ./2.sh ;;
    esac
    echo "PID for 1.sh after exec/source/fork:$$"
    echo "1.sh: \$A is $A"

    
    2.sh 

    #!/bin/bash
    echo "PID for 2.sh: $$"
    echo "2.sh get \$A=$A from 1.sh"
    A=C
    export A
    echo "2.sh: \$A is $A"

然後，分別跑如下參數來觀察結果：

    $ ./1.sh fork
    $ ./1.sh source
    $ ./1.sh exec

或是，你也可以參考 CU 上的另一貼子：  
[http://www.chinaunix.net/forum/viewtopic.php?t=191051](http://www.chinaunix.net/forum/viewtopic.php?t=191051)  
好了，別忘了仔細比較輸出結果的不同及背後的原因哦...  
若有疑問，歡迎提出來一起討論討論~~~

happy scripting! ^_^