##Q13. `for` what?  `while` 與 `until` 差在哪？

終於，來到 shell 十三問的最後一問了...  長長吐一口氣~~~~

最後要介紹的是 shell script 設計中常見的"循環"(loop)。
所謂的 loop 就是 script 中的一段在一定條件下反覆執行的代碼。
bash shell  中常用的 loop 有如下三種：

* `for`
* `while`
* `until`

`for` loop 是從一個清單列表中讀進變量值，並"依次"的循環執行 `do` 到 `done` 之間的命令行。  
例：

    for var in one two three four five
    do
        echo -----------
        echo '$var is '$var
        echo
    done

上例的執行結果將會是：

* 1) `for` 會定義一個叫 `var` 的變量，其值依次是 `one two three four five` 。
* 2) 因為有 5 個變量值，因此 `do` 與 `done` 之間的命令行會被循環執行 5 次。
* 3) 每次循環均用 `echo` 產生三行句子。
     而第二行中不在 hard quote 之內的 `$var` 會依次被替換為 `one two three four five` 。
* 4) 當最後一個變量值處理完畢，循環結束。


我們不難看出，在 `for` loop 中，變量值的多寡，決定循環的次數。
然而，變量在循環中是否使用則不一定，得視設計需求而定。
倘若 `for` loop 沒有使用 `in` 這個 keyword 來指定變量值清單的話，其值將從 `$@` (或 `$*` )中繼承：

    for var; do
        ....
    done

(若你忘記了 positional parameter ，請溫習第 9 章...)

`for` loop 用於處理"清單"(list)項目非常方便，
其清單除了可明確指定或從 positional parameter 取得之外，
也可從變量替換或命令替換取得... (再一次提醒：別忘了命令行的"重組"特性﹗)
然而，對於一些"累計變化"的項目(如整數加減)，`for` 亦能處理：

    for ((i=1;i<=10;i++))
    do
       echo "num is $i"
    done

除了 `for` loop ，上面的例子我們也可改用  `while` loop 來做到：

    num=1
    while [ "$num" -le 10 ]; do
        echo "num is $num"
        num=$(($num + 1))
    done

`while` loop 的原理與 `for` loop 稍有不同：
它不是逐次處理清單中的變量值，而是取決於 `while` 後面的命令行之 return value ：

* 若為 `ture` ，則執行 `do` 與 `done` 之間的命令，然後重新判斷 `while` 後的 return value 。
* 若為 `false` ，則不再執行 `do` 與 `done` 之間的命令而結束循環。

分析上例：

* 1) 在 `while` 之前，定義變量 `num=1` 。
* 2) 然後測試(`test`) `$num` 是否小於或等於 `10` 。
* 3) 結果為 `true` ，於是執行 `echo` 並將 `num` 的值加一。
* 4) 再作第二輪測試，此時 `num` 的值為 `1+1=2` ，依然小於或等於 `10`，因此為 `true` ，繼續循環。
* 5) 直到 `num` 為 `10+1=11` 時，測試才會失敗... 於是結束循環。


我們不難發現：
若 `while` 的測試結果永遠為 `true` 的話，那循環將一直永久執行下去：

while :; do
    echo looping...
done

上例的" `:` "是 bash 的 null command ，不做任何動作，除了送回 `true` 的 return value 。
因此這個循環不會結束，稱作死循環。
死循環的產生有可能是故意設計的(如跑 daemon)，也可能是設計錯誤。
若要結束死尋環，可透過 signal 來終止(如按下 `ctrl-c` )。
(關於 process 與 signal ，等日後有機會再補充，十三問暫時略過。)

一旦你能夠理解 `while` loop 的話，那，就能理解 `until` loop ：

* 與 `while` 相反，`until` 是在 return value 為 `false` 時進入循環，否則結束。

因此，前面的例子我們也可以輕鬆的用 `until` 來寫：

    num=1
    until [ ! "$num" -le 10 ]; do
        echo "num is $num"
        num=$(($num + 1))
    done

或是：

    num=1
    until [ "$num" -gt 10 ]; do
        echo "num is $num"
        num=$(($num + 1))
    done

okay ，關於 bash 的三個常用的 loop 暫時介紹到這裡。
在結束本章之前，再跟大家補充兩個與 loop 有關的命令：

* break
* continue

這兩個命令常用在複合式循環裡，也就是在 `do ... done` 之間又有更進一層的 loop ，
當然，用在單一循環中也未嘗不可啦...  ^_^

`break` 是用來打斷循環，也就是"強迫結束" 循環。
若 `break` 後面指定一個數值 `n` 的話，則"從裡向外"打斷第 `n` 個循環，
預設值為 `break 1` ，也就是打斷當前的循環。
在使用 `break` 時需要注意的是， 它與 `return` 及 `exit` 是不同的：

* `break` 是結束 loop 
* `return` 是結束 function
* `exit` 是結束 script/shell

而 `continue` 則與 `break` 相反：強迫進入下一次循環動作。
若你理解不來的話，那你可簡單的看成：在 `continue` 到 `done` 之間的句子略過而返回循環頂端...
與 `break` 相同的是：`continue` 後面也可指定一個數值 `n` ，以決定繼續哪一層(從裡向外計算)的循環，
預設值為 `continue 1` ，也就是繼續當前的循環。

在 shell script 設計中，若能善用 loop ，將能大幅度提高 script 在複雜條件下的處理能力。
請多加練習吧....


-----------

好了，該是到了結束的時候了。
婆婆媽媽的跟大家囉唆了一堆關於 shell 的基礎概念，
目的不是要告訴大家"答案"，而是要帶給大家"啟發"...
在日後關於 shell 的討論中，我或許會經常用"鏈接"方式指引回來十三問中的內容，
以便我們在進行技術探討時彼此能有一些討論基礎，而不至於各說各話、徒費時力。
但，更希望十三問能帶給你更多的思考與樂趣，至為重要的是透過實作來加深理解。

是的，我很重視"實作"與"獨立思考"這兩項學習要素，若你能夠掌握其中真義，那請容我說聲：
--- 恭喜﹗十三問你沒白看了﹗  ^_^


p.s.  
至於補充問題部份，我暫時不寫了。而是希望：

* 1) 大家擴充題目。
* 2) 一起來寫心得。

Good luck and happy studying!