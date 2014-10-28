##Q11. `>` 與 `<` 差在哪？

這次的題目之前我在 CU 的 shell 版已說明過了：  
(原貼連結在論壇改版後已經失效)  
這次我就不重寫了，將貼子的內容"抄"下來就是了...

**11.1**

談到 I/O redirection ，不妨先讓我們認識一下 File Descriptor (FD) 。 

程式的運算，在大部份情況下都是進行數據(data)的處理，
這些數據從哪讀進？又，送出到哪裡呢？
這就是 file descriptor (FD) 的功用了。 

在 shell 程式中，最常使用的 FD 大概有三個，分別為：

* `0`: Standard Input (STDIN) 
* `1`: Standard Output (STDOUT) 
* `2`: Standard Error Output (STDERR) 

在標準情況下，這些 FD 分別跟如下設備(device)關聯： 

* `stdin(0)`: keyboard 
* `stdout(1)`: monitor 
* `stderr(2)`: monitor 

我們可以用如下下命令測試一下： 

    $ mail -s test root 
    this is a test mail. 
    please skip. 
    ^d (同時按 crtl 跟 d 鍵)

很明顯，`mail` 程式所讀進的數據，就是從 `stdin` 也就是 keyboard 讀進的。
不過，不見得每個程式的 `stdin` 都跟 `mail` 一樣從 keyboard 讀進，
因為程式作者可以從檔案參數讀進 `stdin` ，如：

    $ cat /etc/passwd

但，要是 `cat` 之後沒有檔案參數則又如何呢？
哦，請您自己玩玩看囉.... ^_^ 

    $ cat

(請留意數據輸出到哪裡去了，最後別忘了按 `^d` 離開...) 

至於 `stdout` 與 `stderr` ，嗯... 等我有空再續吧... ^_^
還是，有哪位前輩要來玩接龍呢？ 

**11.2**

沿文再續，書接上一回... ^_^ 

相信，經過上一個練習後，你對 `stdin` 與 `stdout` 應該不難理解吧？
然後，讓我們繼續看 `stderr` 好了。
事實上，`stderr` 沒甚麼難理解的：說穿了就是"錯誤信息"要往哪邊送而已...
比方說，若讀進的檔案參數是不存在的，那我們在 monitor 上就看到了： 

    $ ls no.such.file 
    ls: no.such.file: No such file or directory

若，一個命令同時產生 `stdout` 與 `stderr` 呢？
那還不簡單，都送到 monitor 來就好了： 

    $ touch my.file 
    $ ls my.file no.such.file 
    ls: no.such.file: No such file or directory 
    my.file

okay，至此，關於 FD 及其名稱、還有相關聯的設備，相信你已經沒問題了吧？
那好，接下來讓我們看看如何改變這些 FD 的預設數據通道，
我們可用 `<` 來改變讀進的數據通道(`stdin`)，使之從指定的檔案讀進。
我們可用 `>` 來改變送出的數據通道(`stdout`, `stderr`)，使之輸出到指定的檔案。

比方說： 
    
    $ cat < my.file

就是從 `my.file` 讀進數據 

    $ mail -s test root < /etc/passwd

則是從 `/etc/passwd` 讀進...
這樣一來，`stdin` 將不再是從 keyboard 讀進，而是從檔案讀進了...
嚴格來說，`<` 符號之前需要指定一個 FD 的(之間不能有空白)，
但因為 `0` 是 `<` 的預設值，因此 `<` 與 `0<` 是一樣的﹗ 

okay，這個好理解吧？
那，要是用兩個 `<<` 又是啥呢？
這是所謂的 HERE Document ，它可以讓我們輸入一段文本，直到讀到 `<<` 後指定的字串。
比方說： 

    $ cat <<FINISH 
    first line here 
    second line there 
    third line nowhere 
    FINISH

這樣的話，`cat` 會讀進 3 行句子，而無需從 keyboard 讀進數據且要等 `^d` 結束輸入。 

至於 `>` 又如何呢？  
且聽下回分解....

**11.3**

okay，又到講古時間~~~ 

當你搞懂了 `0<` 原來就是改變 `stdin` 的數據輸入通道之後，相信要理解如下兩個 redirection 就不難了： 

* `1>` 
* `2>` 

前者是改變 `stdout` 的數據輸出通道，後者是改變 `stderr` 的數據輸出通道。
兩者都是將原本要送出到 monitor 的數據轉向輸出到指定檔案去。
由於 `1` 是 `>` 的預設值，因此，`1>` 與 `>` 是相同的，都是改變 `stdout` 。

用上次的 `ls` 例子來說明一下好了： 

    $ ls my.file no.such.file 1>file.out 
    ls: no.such.file: No such file or directory

這樣 monitor 就只剩下 `stderr` 而已。因為 `stdout` 給寫進 `file.out` 去了。

    $ ls my.file no.such.file 2>file.err 
    my.file

這樣 monitor 就只剩下 `stdout` ，因為 `stderr` 寫進了 `file.err` 。

    $ ls my.file no.such.file 1>file.out 2>file.err

這樣 monitor 就啥也沒有，因為 `stdout` 與 `stderr` 都給轉到檔案去了...

呵~~~ 看來要理解 `>` 一點也不難啦﹗是不？沒騙你吧？ ^_^ 
不過，有些地方還是要注意一下的。 

首先，是同時寫入的問題。比方如下這個例子：

    $ ls my.file no.such.file 1>file.both 2>file.both

假如 `stdout(1)` 與 `stderr(2)` 都同時在寫入 `file.both` 的話，
則是採取“覆蓋”方式：後來寫入的覆蓋前面的。
讓我們假設一個 `stdout` 與 `stderr` 同時寫入 `file.out` 的情形好了： 

* 首先 `stdout` 寫入10個字元 
* 然後 `stderr` 寫入 6 個字元

那麼，這時候原本 `stdout` 輸出的 10 個字元就被 `stderr` 覆蓋掉了。

那，如何解決呢？所謂山不轉路轉、路不轉人轉嘛，
我們可以換一個思維：將 `stderr` 導進 `stdout` 或將 `stdout` 導進 `stderr` ，而不是大家在搶同一份檔案，不就行了﹗
bingo﹗就是這樣啦： 

* `2>&1` 就是將 `stderr` 併進 `stdout` 作輸出 
* `1>&2` 或 `>&2` 就是將 `stdout` 併進 `stderr` 作輸出 

於是，前面的錯誤操作可以改為：

    $ ls my.file no.such.file 1>file.both 2>&1 
    或 
    $ ls my.file no.such.file 2>file.both >&2

這樣，不就皆大歡喜了嗎？ 呵~~~ ^_^ 

不過，光解決了同時寫入的問題還不夠，我們還有其他技巧需要了解的。
故事還沒結束，別走開﹗廣告後，我們再回來...﹗

**11.4**

okay，這次不講 I/O Redirction ，講佛吧...
(有沒搞錯？﹗網中人是否頭殼燒壞了？...) 嘻~~~ ^_^ 

學佛的最高境界，就是"四大皆空"。至於是空哪四大塊？我也不知，因為我還沒到那境界... 
但這個"空"字，卻非常值得我們返複把玩的： 

> 色即是空、空即是色﹗ 

好了，施主要是能夠領會"空"的禪意，那離修成正果不遠矣~~~ 

在 Linux 檔案系統裡，有個設備檔位於 `/dev/null` 。
許多人都問過我那是甚麼玩意兒？我跟你說好了：那就是"空"啦﹗
沒錯﹗空空如也的空就是 `null` 了.... 請問施主是否忽然有所頓誤了呢？然則恭喜了~~~ ^_^ 

這個 `null` 在 I/O Redirection 中可有用得很呢： 

* 若將 FD1 跟 FD2 轉到 `/dev/null` 去，就可將 `stdout` 與 `stderr` 弄不見掉。 
* 若將 FD0 接到 `/dev/null` 來，那就是讀進 `nothing` 。 

比方說，當我們在執行一個程式時，畫面會同時送出 `stdout` 跟 `stderr` ，
假如你不想看到 `stderr` (也不想存到檔案去)，那可以：

    $ ls my.file no.such.file 2>/dev/null 
    my.file

若要相反：只想看到 `stderr` 呢？還不簡單﹗將 `stdout` 弄到 `null` 就行： 

    $ ls my.file no.such.file >/dev/null 
    ls: no.such.file: No such file or directory

那接下來，假如單純只跑程式，不想看到任何輸出結果呢？
哦，這裡留了一手上次節目沒講的法子，專門贈予有緣人﹗... ^_^ 
除了用 `>/dev/null 2>&1` 之外，你還可以如此：

    $ ls my.file no.such.file &>/dev/null

(提示：將 `&>` 換成 `>&` 也行啦~~! ) 

okay？講完佛，接下來，再讓我們看看如下情況：

    $ echo "1" > file.out 
    $ cat file.out 
    1 
    $ echo "2" > file.out 
    $ cat file.out 
    2

看來，我們在重導 `stdout` 或 `stderr` 進一份檔案時，似乎永遠只獲得最後一次導入的結果。
那，之前的內容呢？
呵~~~ 要解決這個問提很簡單啦，將 `>` 換成 `>>` 就好：

    $ echo "3" >> file.out 
    $ cat file.out 
    2 
    3

如此一來，被重導的目標檔案之內容並不會失去，而新的內容則一直增加在最後面去。
easy ？ 呵 ... ^_^ 

但，只要你再一次用回單一的 `>` 來重導的話，那麼，舊的內容還是會被"洗"掉的﹗
這時，你要如何避免呢？
----備份﹗ yes ，我聽到了﹗不過.... 還有更好的嗎？
既然與施主這麼有緣份，老納就送你一個錦囊妙法吧：

    $ set -o noclobber 
    $ echo "4" > file.out 
    -bash: file: cannot overwrite existing file

那，要如何取消這個"限制"呢？
哦，將 `set -o` 換成 `set +o` 就行：

    $ set +o noclobber 
    $ echo "5" > file.out 
    $ cat file.out 
    5

再問：那... 有辦法不取消而又"臨時"蓋寫目標檔案嗎？
哦，佛曰：不可告也﹗ 
啊~\~~ 開玩笑的、開玩笑的啦~\~~  ^_^ 唉，早就料到人心是不足的了﹗

    $ set -o noclobber 
    $ echo "6" >| file.out 
    $ cat file.out 
    6

留意到沒有：在 `>` 後面再加個" `|` "就好(注意： `>` 與 `|` 之間不能有空白哦).... 

呼.... (深呼吸吐納一下吧)~~~ ^_^ 
再來還有一個難題要你去參透的呢： 
    
    $ echo "some text here" > file 
    $ cat < file 
    some text here 
    $ cat < file > file.bak 
    $ cat < file.bak 
    some text here 
    $ cat < file > file 
    $ cat < file

嗯？﹗注意到沒有？﹗﹗
---- 怎麼最後那個 `cat` 命令看到的 `file` 竟是空的？﹗
why? why? why? 

同學們：下節課不要遲到囉~~~!

**11.5**

噹噹噹~\~~ 上課囉~\~~ ^_^ 

前面提到：`$ cat < file > file` 之後原本有內容的檔案結果卻被洗掉了﹗
要理解這一現像其實不難，這只是 priority 的問題而已：

* 在 IO Redirection 中，`stdout` 與 `stderr` 的管道會先準備好，才會從 `stdin` 讀進資料。

也就是說，在上例中，`> file` 會先將 `file` 清空，然後才讀進 `< file` ，
但這時候檔案已經被清空了，因此就變成讀不進任何資料了... 

哦~\~~ 原來如此~\~~~ ^_^
那... 如下兩例又如何呢？

    $ cat <> file 
    $ cat < file >> file

嗯... 同學們，這兩個答案就當練習題囉，下節課之前請交作業﹗ 

好了，I/O Redirection 也快講完了，sorry，因為我也只知道這麼多而已啦~\~~ 嘻~\~ ^_^ 
不過，還有一樣東東是一定要講的，各位觀眾(請自行配樂~!#@!$%) ：
**就是 pipe line 也﹗** 

談到 pipe line ，我相信不少人都不會陌生：
我們在很多 command line 上常看到的" `|` "符號就是 pipe line 了。
不過，究竟 pipe line 是甚麼東東呢？
別急別急... 先查一下英漢字典，看看 pipe 是甚麼意思？
沒錯﹗它就是"水管"的意思... 
那麼，你能想像一下水管是怎麼一根接著一根的嗎？
又，每根水管之間的 input 跟 output 又如何呢？
嗯？？
靈光一閃：原來 pipe line 的 I/O 跟水管的 I/O 是一模一樣的：

* 上一個命令的 `stdout` 接到下一個命令的 `stdin` 去了﹗ 

的確如此... 不管在 command line 上你使用了多少個 pipe line ，
前後兩個 command 的 I/O 都是彼此連接的﹗(恭喜：你終於開竅了﹗ ^_^ ) 

不過... 然而... 但是... ... `stderr` 呢？
好問題﹗不過也容易理解：

* 若水管漏水怎麼辦？ 

也就是說：在 pipe line 之間，前一個命令的 `stderr` 是不會接進下一命令的 `stdin` 的，
其輸出，若不用 `2>` 導到 file 去的話，它還是送到監視器上面來﹗ 
這點請你在 pipe line 運用上務必要注意的。

那，或許你又會問：

* 有辦法將 stderr 也餵進下一個命令的 stdin 去嗎？

(貪得無厭的家夥﹗)   
方法當然是有，而且你早已學過了﹗ ^_^ 
我提示一下就好： 

* 請問你如何將 `stderr` 合併進 `stdout` 一同輸出呢？ 

若你答不出來，下課之後再來問我吧... (如果你臉皮真夠厚的話...) 

或許，你仍意尤未盡﹗或許，你曾經碰到過下面的問題：

* 在 `cm1 | cm2 | cm3` ... 這段 pipe line 中，若要將 `cm2` 的結果存到某一檔案呢？ 

若你寫成 `cm1 | cm2 > file | cm3` 的話，
那你肯定會發現 `cm3` 的 `stdin` 是空的﹗(當然啦，你都將水管接到別的水池了﹗) 
聰明的你或許會如此解決：

    cm1 | cm2 > file ; cm3 < file

是的，你的確可以這樣做，但最大的壞處是：這樣一來，`file I/O` 會變雙倍﹗
在 command 執行的整個過程中，`file` I/O 是最常見的最大效能殺手。
凡是有經驗的 shell 操作者，都會盡量避免或降低 `file` I/O 的頻率。

那，上面問題還有更好方法嗎？   
有的，那就是 `tee` 命令了。

* 所謂 `tee` 命令是在不影響原本 I/O 的情況下，將 `stdout` 複製一份到檔案去。

因此，上面的命令行可以如此打： 

    cm1 | cm2 | tee file | cm3

在預設上，`tee` 會改寫目標檔案，若你要改為增加內容的話，那可用 `-a` 參數達成。 

基本上，pipe line 的應用在 shell 操作上是非常廣泛的，尤其是在 text filtering 方面， 
凡舉 `cat`, `more`, `head`, `tail`, `wc`, `expand`, `tr`, `grep`, `sed`, `awk`, ... 等等文字處理工具，  
搭配起 pipe line 來使用，你會驚覺 command line 原來是活得如此精彩的﹗
常讓人有"眾裡尋他千百度，驀然回首，那人卻在燈火闌珊處﹗"之感... ^_^ 

.... 

好了，關於 I/O Redirection 的介紹就到此告一段落。
若日後有空的話，再為大家介紹其它在 shell 上好玩的東西﹗bye... ^_^