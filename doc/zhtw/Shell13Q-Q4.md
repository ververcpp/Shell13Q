##Q4. `" "`(雙引號) 與 `' '`(單引號)差在哪？

還是回到我們的 command line 來吧...
經過前面兩章的學習，應該很清楚當你在 shell prompt 後面敲打鍵盤、直到按下 Enter 的時候，
你輸入的文字就是 command line 了，然後 shell 才會以行程的方式執行你所交給它的命令。
但是，你又可知道：你在 command line 輸入的每一個文字，對 shell 來說，是有類別之分的呢？

簡單而言(我不敢說這是精確的定議，註一)，command line 的每一個 charactor ，分為如下兩種：

* `literal`：也就是普通純文字，對 shell 來說沒特殊功能。
* `meta`：對 shell 來說，具有特定功能的特殊保留字元。

> (註一：關於 bash shell 在處理 command line 時的順序說明，
請參考 O'Reilly 出版社之 Learning the Bash Shell, 2nd Edition，第 177 - 180 頁的說明，
尤其是 178 頁的流程圖 Figure 7-1 ... )

`literal` 沒甚麼好談的，凡舉 `abcd`、`123456` 這些"文字"都是 `literal` ... (easy？)
但 `meta` 卻常使我們困惑..... (confused?)
事實上，前兩章我們在 command line 中已碰到兩個機乎每次都會碰到的 `meta` ：

* IFS：由 `<space>` 或 `<tab>` 或 `<enter>` 三者之一組成(我們常用 `<space>` )。
* CR：由 `<enter>` 產生。

IFS 是用來拆解 command line 的每一個詞(word)用的，因為 shell command line 是按詞來處理的。
而 CR 則是用來結束 command line 用的，這也是為何我們敲 `<enter>` 命令就會跑的原因。
除了 IFS 與 CR ，常用的 `meta` 還有：

* `=` ：設定變量。
* `$` ：作變量或運算替換(請不要與 shell prompt 搞混了)。
* `>` ：重導向 stdout。
* `<` ：重導向 stdin。
* `|` ：命令管線。
* `&` ：重導向 file descriptor ，或將命令置於背境執行。
* `( )` ：將其內的命令置於 nested subshell 執行，或用於運算或命令替換。
* `{ }` ：將其內的命令置於 non-named function 中執行，或用在變量替換的界定範圍。
* `;` ：在前一個命令結束時，而忽略其返回值，繼續執行下一個命令。
* `&&` ：在前一個命令結束時，若返回值為 `true`，繼續執行下一個命令。
* `||` ：在前一個命令結束時，若返回值為 `false`，繼續執行下一個命令。
* `!` ：執行 history 列表中的命令
* ....

假如我們需要在 command line 中將這些保留字元的功能關閉的話，就需要 quoting 處理了。
在 bash 中，常用的 quoting 有如下三種方法：

* hard quote：`' '` (單引號)，凡在 hard quote 中的所有 `meta` 均被關閉。
* soft quote： `" "` (雙引號)，在 soft quoe 中大部份 `meta` 都會被關閉，但某些則保留(如 `$` )。(註二)
* escape ： `\`(反斜線)，只有緊接在 escape (跳脫字符)之後的單一 `meta` 才被關閉。

> ( 註二：在 soft quote 中被豁免的具體 `meta` 清單，我不完全知道，
有待大家補充，或透過實作來發現及理解。 )

下面的例子將有助於我們對 quoting 的了解：

    $ A=B C        # 空白鍵未被關掉，作為 IFS 處理。
    $ C: command not found. 
    $ echo $A
    
    $ A="B C"        # 空白鍵已被關掉，僅作為空白鍵處理。
    $ echo $A
    B C

在第一次設定 `A` 變量時，由於空白鍵沒被關閉，command line 將被解讀為：

> `A=B` 然後碰到`<IFS>`，再執行 `C` 命令

在第二次設定  A 變量時，由於空白鍵被置於 soft quote 中，因此被關閉，不再作為 IFS ：

> `A=B<space>C`

事實上，空白鍵無論在 soft quote 還是在 hard quote 中，均會被關閉。`Enter` 鍵亦然：

    $ A='B
    > C
    > '
    $ echo "$A"
    B
    C

在上例中，由於 `<enter>` 被置於 hard quote 當中，因此不再作為 CR 字符來處理。
這裡的 `<enter>` 單純只是一個斷行符號(new-line)而已，由於 command line 並沒得到 CR 字符，
因此進入第二個 shell prompt (PS2，以 `>` 符號表示)，command line 並不會結束，
直到第三行，我們輸入的 `<enter>` 並不在  hard quote 裡面，因此並沒被關閉，
此時，command line 碰到 CR 字符，於是結束、交給 shell 來處理。

上例的 `<enter>` 要是被置於 soft quote 中的話， CR 也會同樣被關閉：

    $ A="B
    > C
    > "
    $ echo $A
    B C

然而，由於 `echo $A` 時的變量沒至於 soft quote 中，因此當變量替換完成後並作命令行重組時，`<enter>` 會被解釋為 IFS ，而不是解釋為 New Line 字符。

同樣的，用 escape 亦可關閉 CR 字符：

    $ A=B\
    > C\
    >
    $ echo $A
    BC

上例中，第一個 `<enter>` 跟第二個 `<enter>` 均被 escape 字符關閉了，因此也不作為 CR 來處理，
但第三個 `<enter>` 由於沒被跳脫，因此作為 CR 結束 command line 。
但由於 `<enter>` 鍵本身在 shell meta 中的特殊性，在 `\` 跳脫後面，僅僅取消其 CR 功能，而不會保留其 IFS 功能。

您或許發現光是一個 `<enter>` 鍵所產生的字符就有可能是如下這些可能：

* CR
* IFS
* NL(New Line)
* FF(Form Feed)
* NULL
* ...

至於甚麼時候會解釋為甚麼字符，這個我就沒去深挖了，或是留給讀者諸君自行慢慢摸索了... ^_^

至於 soft quote 跟 hard quote 的不同，主要是對於某些 `meta` 的關閉與否，以 `$` 來作說明：

    $ A=B\ C
    $ echo "$A"
    B C
    $ echo '$A'
    $A

在第一個 `echo` 命令行中，`$` 被置於 soft quote 中，將不被關閉，因此繼續處理變量替換，
因此 `echo` 將 `A` 的變量值輸出到熒幕，也就得到  `B C` 的結果。
在第二個 `echo` 命令行中，`$` 被置於 hard quote 中，則被關閉，因此 `$` 只是一個 `$` 符號，
並不會用來作變量替換處理，因此結果是 `$` 符號後面接一個 `A` 字母：`$A` 。

練習與思考：如下結果為何不同？

    $ A=B\ C
    $ echo '"$A"'        # 最外面的是單引號
    "$A"
    $ echo "'$A'"        # 最外面的是雙引號
    'B C'

(提示：單引號及雙引號，在 quoting 中均被關閉了。)

在 CU 的 shell 版裡，我發現有很多初學者的問題，都與 quoting 理解的有關。
比方說，若我們在 `awk` 或 `sed` 的命令參數中調用之前設定的一些變量時，常會問及為何不能的問題。
要解決這些問題，關鍵點就是：

> 區分出 shell meta 與 command meta 

前面我們提到的那些 `meta` ，都是在 command line 中有特殊用途的，
比方說 `{ }` 是將其內一系列 command line 置於不具名的函式中執行(可簡單視為 command block )，
但是，`awk` 卻需要用 `{ }` 來區分出 `awk` 的命令區段(BEGIN, MAIN, END)。
若你在 command line 中如此輸入：

    $ awk {print $0} 1.txt

由於  `{ }` 在 shell 中並沒關閉，那 shell 就將 `{print $0}` 視為 command block ，
但同時又沒有" `;` "符號作命令區隔，因此就出現 `awk` 的語法錯誤結果。

要解決之，可用 hard quote ：
    
    $ awk '{print $0}' 1.txt

上面的 hard quote 應好理解，就是將原本的 `{`、`<space>`、`$`(註三)、`}` 這幾個 shell meta 關閉，
避免掉在 shell 中遭到處理，而完整的成為 `awk` 參數中的 command meta 。  
> ( 註三：而其中的 `$0` 是 `awk` 內建的 field number ，而非 `awk` 的變量，
`awk` 自身的變量無需使用 `$` 。)

要是理解了 hard quote 的功能，再來理解 soft quote 與 escape 就不難：

    awk "{print \$0}" 1.txt
    awk \{print\ \$0\} 1.txt

然而，若你要改變 `awk` 的 `$0` 的 `0` 值是從另一個 shell 變量讀進呢？  
比方說：已有變量 `$A` 的值是 `0` ，那如何在 command line 中解決 `awk` 的 `$$A` 呢？  
你可以很直接否定掉 hard quoe 的方案：

    $ awk '{print $$A}' 1.txt

那是因為 `$A` 的 `$` 在 hard quote 中是不能替換變量的。

聰明的讀者(如你!)，經過本章學習，我想，應該可以解釋為何我們可以使用如下操作了吧：

    A=0
    awk "{print \$$A}" 1.txt
    awk \{print\ \$$A\} 1.txt
    awk '{print $'$A'}' 1.txt
    awk '{print $'"$A"'}' 1.txt     # 注："$A" 包在 soft quote 中

或許，你能舉出更多的方案呢....  ^_^


練習與思考：請運用本章學到的知識分析如下兩串討論：

* [http://bbs.chinaunix.net/forum/viewtopic.php?t=207178](http://bbs.chinaunix.net/forum/viewtopic.php?t=207178)
* [http://bbs.chinaunix.net/forum/viewtopic.php?t=216729](http://bbs.chinaunix.net/forum/viewtopic.php?t=207178)
