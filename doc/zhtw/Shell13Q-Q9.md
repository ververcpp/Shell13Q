##Q9. `$@` 與 `$*` 差在哪？

要說 `$@` 與 `$*` 之前，需得先從 shell script 的 positional parameter 談起...
我們都已經知道變量(variable)是如何定義及替換的，這個不用再多講了。
但是，我們還需要知道有些變量是 shell 內定的，且其名稱是我們不能隨意修改的，
其中就有 positional parameter 在內。

在 shell script 中，我們可用 `$0`, `$1`, `$2`, `$3` ... 這樣的變量分別提取命令行中的如下部份：

    script_name parameter1 parameter2 parameter3 ...

我們很容易就能猜出 `$0` 就是代表 shell script 名稱(路逕)本身，而 `$1` 就是其後的第一個參數，如此類推....
須得留意的是 IFS 的作用，也就是，若 IFS 被 quoting 處理後，那麼 positional parameter 也會改變。  
如下例：

    my.sh p1 "p2 p3" p4

由於在 `p2` 與 `p3` 之間的空白鍵被 soft quote 所關閉了，因此 `my.sh` 中的 `$2` 是 `"p2 p3"` 而 `$3` 則是 `p4` ...

還記得前兩章我們提到 `function` 時，我不是說過它是 script 中的 script 嗎？  ^_^  
是的，`function` 一樣可以讀取自己的(有別於 script 的) postitional parameter ，惟一例外的是 `$0` 而已。  
舉例而言：假設 `my.sh` 裡有一個 `function` 叫 `my_fun` , 若在 script 中跑 `my_fun fp1 fp2 fp3` ，
那麼，`function` 內的 `$0` 是 `my.sh` ，而 `$1` 則是 `fp1` 而非 `p1` 了...

不如寫個簡單的 my.sh script  看看吧：

    #!/bin/bash

    my_fun() {
        echo '$0 inside function is '$0
        echo '$1 inside function is '$1
        echo '$2 inside function is '$2
    }

    echo '$0 outside function is '$0
    echo '$1 outside function is '$1
    echo '$2 outside function is '$2

    my_fun fp1 "fp2 fp3"

然後在 command line 中跑一下 script 就知道了：

    chmod +x my.sh
    ./my.sh p1 "p2 p3"
    $0 outside function is ./my.sh
    $1 outside function is p1
    $2 outside function is p2 p3
    $0 inside function is ./my.sh
    $1 inside function is fp1
    $2 inside function is fp2 fp3

然而，在使用 positional parameter 的時候，我們要注意一些陷阱哦：

* `$10` 不是替換第 `10` 個參數，而是替換第一個參數(`$1`)然後再補一個 `0` 於其後﹗

也就是，`my.sh one two three four five six seven eigth nine ten` 這樣的 command line ，
`my.sh` 裡的 `$10` 不是 `ten` 而是 `one0` 哦... 小心小心﹗  
要抓到 `ten` 的話，有兩種方法：

* 方法一，是使用我們上一章介紹的 `${ }` ，也就是用 `${10}` 即可。
* 方法二，就是 `shift` 了。

用通俗的說法來說，所謂的 `shift` 就是取消 positional parameter 中最左邊的參數( `$0` 不受影響)。  
其預設值為 `1` ，也就是 `shift` 或 `shift 1`  都是取消 `$1` ，而原本的 `$2` 則變成 `$1`、`$3` 變成 `$2` ...  
若 `shift 3` 則是取消前面三個參數，也就是原本的 `$4` 將變成 `$1` ...  
那，親愛的讀者，你說要 `shift` 掉多少個參數，才可用 `$1` 取得 `${10}` 呢？ ^_^  

okay，當我們對 positional parameter 有了基本概念之後，那再讓我們看看其他相關變量吧。  
首先是 `$#` ：它可抓出 positional parameter 的數量。  
以前面的 `my.sh p1 "p2 p3"` 為例：    
由於 `p2` 與 `p3` 之間的 IFS 是在 soft quote 中，因此 `$#` 可得到 `2` 的值。  
但如果 `p2` 與 `p3` 沒有置於 quoting 中話，那 `$#` 就可得到 `3` 的值了。  
同樣的道理在 `function` 中也是一樣的...  

因此，我們常在 shell script 裡用如下方法測試 script 是否有讀進參數：

    [ $# = 0 ]

假如為 `0` ，那就表示 script 沒有參數，否則就是有帶參數...

接下來就是 `$@` 與 `$*` ：  
精確來講，兩者只有在 soft quote 中才有差異，否則，都表示"全部參數"( `$0` 除外)。  
舉例來說好了：  
若在 command line 上跑 `my.sh p1 "p2 p3" p4` 的話，  
不管是 `$@` 還是 `$*` ，都可得到 `p1 p2 p3 p4` 就是了。  
但是，如果置於 soft quote 中的話：  
"`$@`" 則可得到 "`p1`" "`p2 p3`" "`p4`" 這三個不同的詞段(word)﹔  
"`$*`" 則可得到 "`p1 p2 p3 p4`" 這一整串單一的詞段。  

我們可修改一下前面的 `my.sh` ，使之內容如下：

    #!/bin/bash

    my_fun() {
        echo "$#"
    }

    echo 'the number of parameter in "$@" is '$(my_fun "$@")
    echo 'the number of parameter in "$*" is '$(my_fun "$*")

然後再執行 `./my.sh p1 "p2 p3" p4` 就知道 `$@` 與 `$*` 差在哪了 ...    ^_^