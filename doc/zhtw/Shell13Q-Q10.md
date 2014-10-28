##Q10. `&&` 與 `||` 差在哪？

好不容易，進入兩位數的章節了... 一路走來，很辛苦吧？也很快樂吧？  ^_^

在解答本章題目之前，先讓我們了解一個概念：return value ﹗  
我們在 shell 下跑的每一個 command 或 function ，在結束的時候都會傳回父行程一個值，稱為 return value 。  
在 shell command line 中可用 `$?` 這個變量得到最"新"的一個 return value ，也就是剛結束的那個行程傳回的值。  
Return Value(RV) 的取值為 0-255 之間，由程式(或 script)的作者自行定議：  

* 若在 script 裡，用 `exit` RV 來指定其值，若沒指定，在結束時以最後一道命令之 RV 為值。  
* 若在 function 裡，則用 `return` RV 來代替 `exit` RV 即可。

Return Value 的作用，是用來判斷行程的退出狀態(exit status)，只有兩種：

* `0` 的話為"真"( `true` )
* 非`0` 的話為"假"( `false` )

舉個例子來說明好了：
假設當前目錄內有一份 `my.file` 的文件，而 `no.file` 是不存在的：

    $ touch my.file
    $ ls my.file
    $ echo $?        # first echo
    0
    $ ls no.file
    ls: no.file: No such file or directory
    $ echo $?        # second echo
    1
    $ echo $?        # third echo
    0

上例的第一個 `echo` 是關於 `ls my.file` 的 RV ，可得到 `0` 的值，因此為 `true` ﹔  
第二個 `echo` 是關於 `ls no.file` 的 RV ，則得到非 `0`  的值，因此為 `false`﹔  
第三個 `echo` 是關於第二個 `echo $?` 的 RV ，為 `0` 的值，因此也為 `true` 。

請記住：每一個 command 在結束時都會送回 return value 的﹗不管你跑甚麼樣的命令...  
然而，有一個命令卻是"專門"用來測試某一條件而送出 return value 以供 true 或 false 的判斷，  
它就是 `test` 命令了﹗
若你用的是 `bash` ，請在 command line 下打 `man test` 或 `man bash` 來了解這個 `test` 的用法。  
這是你可用作參考的最精確的文件了，要是聽別人說的，僅作參考就好...   
下面我只簡單作一些輔助說明，其餘的一律以 `man` 為準：

首先，`test` 的表示式我們稱為 `expression` ，其命令格式有兩種：

    test expression 
    or:
    [ expression ]

(請務必注意 `[ ]` 之間的空白鍵﹗)  
用哪一種格式沒所謂，都是一樣的效果。(我個人比較喜歡後者...)

其次，`bash` 的 `test` 目前支援的測試對像只有三種：

* `string`：字串，也就是純文字。
* `integer`：整數( `0` 或正整數，不含負數或小數點)。
* `file`：文件。

請初學者一定要搞清楚這三者的差異，因為 `test` 所用的 expression 是不一樣的。  
以 A=123 這個變量為例：

* `[ "$A" = 123 ]`：是字串的測試，以測試 `$A` 是否為 `1`、`2`、`3` 這三個連續的"文字"。
* `[ "$A" -eq 123 ]`：是整數的測試，以測試 `$A` 是否等於"一百二十三"。
* `[ -e "$A" ]`：是關於文件的測試，以測試 `123` 這份"文件"是否存在。 

第三，當 expression 測試為"真"時，`test` 就送回 `0` (`true`) 的 return value ，否則送出非 `0` (`false`)。  
若在 expression 之前加上一個 " `!` "(感嘆號)，則是當 expression 為"假時" 才送出 `0` ，否則送出非 `0` 。  
同時，test 也允許多重的覆合測試：

* `expression1 -a expression2` ：當兩個 exrepssion 都為 `true` ，才送出 `0` ，否則送出非 `0` 。
* `expression1 -o expression2` ：只需其中一個 exrepssion 為 `true` ，就送出 `0` ，只有兩者都為 `false` 才送出非 `0` 。

例如：

    [ -d "$file" -a -x "$file" ]

是表示當 `$file` 是一個目錄、且同時具有 `x` 權限時，`test` 才會為 `true` 。

第四，在 command line 中使用 `test` 時，請別忘記命令行的"重組"特性，  
也就是在碰到 `meta` 時會先處理 `meta` 再重新組建命令行。(這個特性我在第二及第四章都曾反覆強調過)  
比方說，若 `test` 碰到變量或命令替換時，若不能滿足 expression 格式時，將會得到語法錯誤的結果。  
舉例來說好了：

關於 `[ string1 = string2 ]` 這個 `test` 格式，  
在 `=` 號兩邊必須要有字串，其中包括空(`null`)字串(可用 soft quote  或 hard quote 取得)。  
假如 `$A` 目前沒有定義，或被定議為空字串的話，那如下的寫法將會失敗：

    $ unset A
    $ [ $A = abc ]
    [: =: unary operator expected

這是因為命令行碰到  `$` 這個 `meta` 時，會替換 `$A` 的值，然後再重組命令行，那就變成了：
    
    [ = abc ]

如此一來 `=` 號左邊就沒有字串存在了，因此造成 `test` 的語法錯誤﹗    
但是，下面這個寫法則是成立的：

    $ [ "$A" = abc ]
    $ echo $?
    1

這是因為在命令行重組後的結果為：  
    
    [ "" = abc ]

由於 `=` 左邊我們用 soft quote 得到一個空字串，而讓 `test` 語法得以通過... 

讀者諸君請務必留意這些細節哦，因為稍一不慎，將會導至 `test` 的結果變了個樣﹗  
若您對 `test` 還不是很有經驗的話，那在使用 `test` 時不妨先採用如下這一個"法則"：

* 假如在 `test` 中碰到變量替換，用 soft quote 是最保險的﹗

若你對 quoting 不熟的話，請重新溫習第四章的內容吧...  ^_^

okay，關於更多的 `test` 用法，老話一句：請看 `man page` 吧﹗  ^_^

雖然洋洋灑灑講了一大堆，或許你還在嘀咕.... 那... 那個 return value 有啥用啊？﹗
問得好﹗  
告訴你：return value 的作用可大了﹗若你想讓你的 shell 變"聰明"的話，就全靠它了：

* 有了 return value，我們可以讓 shell 跟據不同的狀態做不同的時情...

這時候，才讓我來揭曉本章的答案吧~~~  ^_^  
`&&` 與 `||` 都是用來"組建"多個 command line 用的：

* `command1 && command2` ：其意思是 `command2` 只有在 RV 為 `0` (`true`) 的條件下執行。
* `command1 || command2` ：其意思是 `command2` 只有在 RV 為非 `0` (`false`) 的條件下執行。

來，以例子來說好了：

    $ A=123
    $ [ -n "$A" ] && echo "yes! it's ture."
    yes! it's ture.
    $ unset A
    $ [ -n "$A" ] && echo "yes! it's ture."
    $ [ -n "$A" ] || echo "no, it's NOT ture."
    no, it's NOT ture.

(註：`[ -n string ]` 是測試 `string` 長度大於 `0` 則為 `true` 。)

上例的第一個 `&&` 命令行之所以會執行其右邊的 `echo` 命令，是因為上一個 `test` 送回了 `0` 的 RV 值﹔  
但第二次就不會執行，因為 `test` 送回非 `0` 的結果...  
同理，`||` 右邊的 `echo` 會被執行，卻正是因為左邊的 `test` 送回非 `0` 所引起的。

事實上，我們在同一命令行中，可用多個 `&&` 或 `||` 來組建呢：

    $ A=123
    $ [ -n "$A" ] && echo "yes! it's ture." || echo "no, it's NOT ture."
    yes! it's ture.
    $ unset A
    $ [ -n "$A" ] && echo "yes! it's ture." || echo "no, it's NOT ture."
    no, it's NOT ture.

怎樣，從這一刻開始，你是否覺得我們的 shell 是"很聰明"的呢？  ^_^

好了，最後，佈置一道習題給大家做做看、、、    
下面的判斷是：當 `$A` 被賦與值時，再看是否小於 `100` ，否則送出 `too big!` ：

    $ A=123
    $ [ -n "$A" ] && [ "$A" -lt 100 ] || echo 'too big!'
    too big!

若我將 `A` 取消，照理說，應該不會送文字才對啊(因為第一個條件就不成立了)...

    $ unset A
    $ [ -n "$A" ] && [ "$A" -lt 100 ] || echo 'too big!'
    too big!

為何上面的結果也可得到呢？  
又，如何解決之呢？  
(提示：修改方法很多，其中一種方法可利用第七章介紹過的 command group ...)

快﹗告我我答案﹗其餘免談....