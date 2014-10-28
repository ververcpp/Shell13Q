##Q3. 別人 `echo`、你也 `echo` ，是問 `echo` 知多少？

承接上一章所介紹的 command line ，這裡我們用 `echo` 這個命令加以進一步說明。
溫習---標準的 command line 包含三個部件：

> command_name option argument

`echo` 是一個非常簡單、直接的 Linux 命令：

> 將 argument 送出至標準輸出(STDOUT)，通常就是在監視器(monitor)上輸出。
(註：stdout 我們日後有機會再解說，或可先參考如下討論：
[http://www.chinaunix.net/forum/viewtopic.php?t=191375](http://www.chinaunix.net/forum/viewtopic.php?t=191375 ))

為了更好理解，不如先讓我們先跑一下 `echo` 命令好了：

    $ echo
    
    $

你會發現只有一個空白行，然後又回到 shell prompt 上了。
這是因為 `echo` 在預設上，在顯示完 argument 之後，還會送出一個換行符號(new-line charactor)。
但是上面的 command 並沒任何的 argument ，那結果就只剩一個換行符號了...
若你要取消這個換行符號，可利用 `echo` 的 `-n` option ：

    $ echo -n
    $

不妨讓我們回到 command line 的概念上來討論上例的 `echo` 命令好了：

> command line 只有 command_name(`echo`) 及 option(`-n`)，並沒有任何 argument 。

要想看看 `echo` 的 argument ，那還不簡單﹗接下來，你可試試如下的輸入：

    $ echo first line
    first line
    $ echo -n first line
    first line $

於上兩個 `echo` 命令中，你會發現 argument 的部份顯示在你的熒幕，而換行符號則視 `-n` option 的有無而別。
很明顯的，第二個 `echo` 由於換行符號被取消了，接下來的 shell prompt 就接在輸出結果同一行了... ^_^

事實上，`echo` 除了 `-n` options 之外，常用選項還有：
* `-e` ：啟用反斜線控制字符的轉換(參考下表)
* `-E` ：關閉反斜線控制字符的轉換(預設如此)
* `-n` ：取消行末之換行符號(與 `-e` 選項下的 `\c` 字符同意)

關於 `echo` 命令所支援的反斜線控制字符如下表：
* `\a`：ALERT / BELL (從系統喇叭送出鈴聲)
* `\b`：BACKSPACE ，也就是向左退格鍵
* `\c`：取消行末之換行符號
* `\E`：ESCAPE，跳脫鍵
* `\f`：FORMFEED，換頁字符
* `\n`：NEWLINE，換行字符
* `\r`：RETURN，回車鍵
* `\t`：TAB，表格跳位鍵
* `\v`：VERTICAL TAB，垂直表格跳位鍵
* `\n`：ASCII 八進位編碼(以 x 開首為十六進位)
* `\\`：反斜線本身  
(表格資料來自 O'Reilly 出版社之 Learning the Bash Shell, 2nd Ed.)

或許，我們可以透過實例來了解 `echo` 的選項及控制字符：

例一：

    $ echo -e "a\tb\tc\nd\te\tf"
    a       b       c
    d       e       f

上例運用 `\t` 來區隔 `abc` 還有 `def` ，及用 `\n` 將 `def` 換至下一行。

例二：

    $ echo -e "\141\011\142\011\143\012\144\011\145\011\146"
    a       b       c
    d       e       f

與例一的結果一樣，只是使用 ASCII 八進位編碼。

例三：

    $ echo -e "\x61\x09\x62\x09\x63\x0a\x64\x09\x65\x09\x66"
    a       b       c
    d       e       f

與例二差不多，只是這次換用 ASCII 十六進位編碼。

例四：

    $ echo -ne "a\tb\tc\nd\te\bf\a"
    a       b       c
    d       f $

因為 `e` 字母後面是退格鍵(`\b`)，因此輸出結果就沒有 `e` 了。
在結束時聽到一聲鈴嚮，那是 `\a` 的傑作﹗
由於同時使用了 `-n` 選項，因此 shell prompt 緊接在第二行之後。
若你不用 `-n` 的話，那你在 `\a` 後再加個 `\c` ，也是同樣的效果。

事實上，在日後的 shell 操作及 shell script 設計上，`echo` 命令是最常被使用的命令之一。
比方說，用 `echo` 來檢查變量值：

    $ A=B
    $ echo $A
    B
    $ echo $?
    0

(註：關於變量概念，我們留到下兩章才跟大家說明。)

好了，更多的關於 command line 的格式，以及 `echo` 命令的選項，
就請您自行多加練習、運用了...