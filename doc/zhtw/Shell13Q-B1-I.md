##B1-I. [^ ] 跟 [! ] 差在哪？(Wildcard)

這個問題等了好久都沒人出來補充, 而我呢, 也被追殺了好幾回...  ^_^
趁著今晚有一點空閒, 趕快將此樁心事做一了結吧...

這道題目說穿了, 就是要探討 Wildcard 與 Regular Expression 的差別的.
這也是許多初學 shell 的朋友很容易混亂的地方.
首先, 讓我們回到十三問之第 2 問, 再一次將我們提到的 command line format 溫習一次:

    command_name options arguments

同時, 也再來理解一下我在第 5 問所提到的變量替換的特性:

> 先替換, 再重組 command lline!

有了這兩道基礎後, 才讓我們來看看 wildcard 是甚麼回事吧.

**Part-I: Wildcard**

首先, wildcard 也是屬於 command line 的處理工序, 作用於 argument 裡的 path 之上.
沒錯, 它不用在 command_name 也不用在 options 上.
而且, 若 argument 不是 path 的話, 那也與 wildcard 無關.
換句更為精確的定義來講, wildcard 是一種命令行的路逕擴展(path expansion)功能.
提到這個擴展, 那就不要忘記了 command line 的"重組"特性了!
是的, 這與變量替換(variable substitution)及命令替換(command substitution)的重組特性是一樣的!
也就是在 wildcard 進行擴展後, 命令行會先完成重組才會交給 shell 來處理.

了解了 wildcard 的擴展與重組特性後, 接下來, 讓我們了解一些常見的 wildcard 吧:

* *: 匹配 0 或多個字元
* ?: 匹配任意單一字元
* _: 匹配 list 中的任意單一字元(註一)
* [!list]: 匹配不在 list 中的任意單一字元
* {string1,string2,...}: 匹配 sring1 或 string2 (或更多)其一字串
* (註一: list 可以為指定的個別字元, 如 abcd; 也可以為一段 ASCII 字元的起止範圍, 如: a-d .)

例:
* a*b: a 與 b 之間可以有任意長度的任意字元, 也可以一個也沒有, 如: aabcb, axyzb, a012b, ab 等.
* a?b: a 與 b 之間必須也只能有一個字元, 可以是任意字元, 如: aab, abb, acb, a0b 等.
* a[xyz]b: a 與 b 之間必須也只能有一個字元, 但只能是 x 或 y 或 z, 如: axb, ayb, azb 這三個.
* a[!0-9]b: a 與 b 之間必須也只能有一個字元, 但不能是阿拉伯數字, 如: axb, aab, a-b 等.
* a{abc,xyz,123}b: a 與 b 之間只能是 abc 或 xyz 或 123 這三個字串之一, 如 aabcb, axyzb, a123b 這三個.

*注意:*

1) [! ] 中的 ! 只有放在第一順位時, 才有排除之功. 舉例說:
> [!a]* 表示當前目錄下所有不以 a 開首的路逕名稱.
/tmp/[a\!]* 表示 /tmp 目錄下以 a 或 ! 開首的路逕名稱. (思考: 為何 ! 前面要加 \ 呢? 提示: 十三問之 4 )

2) [ -] 中的 - 左右兩邊均有字元時, 才表示一段範圍, 否則僅作 "-"(減號) 字元來處理. 舉例說:
> /tmp/*[-z]/[a-zA-Z]* 表示 /tmp 目錄下所有以 z 或 - 結尾的子目錄下以英文字母(不分大小寫)開首的路逕名稱.

3) 以 * 或 ? 開首的 wildcard 不能匹配隱藏文件(即以 . 開首的文件). 舉例說:
> *.txt 並不能匹配 .txt 但可匹配 1.txt 這樣的路逕名稱.
但 1*txt 及 1?txt 均可匹配 1.txt 這樣的路逕名稱.

基本上, 要掌握 wildcard 並不難, 只要多加練習, 再勤於思考, 就能熟加運用了.
再次提醒: 別忘了"擴充+重組"這個重要特性, 而且只作用在 argument 的 path 上.
比方說, 假設當前目錄下有 a.txt b.txt c.txt 1.txt 2.txt 3.txt 這幾份文件.
當我們在命令行中下達 ls -l [0-9].txt 的命令行時, 
因為 wildcard 處於 argument 的位置上, 於是根據其匹配的路逕, 擴展為 1.txt 2.txt 3.txt ,
再重組出 ls -l 1.txt 2.txt 3.txt 這樣的命令行.
因此, 你在命令行上敲 ls -l [0-9].txt 與 ls -l 1.txt 2.txt 3.txt 都是同樣的結果, 其原因正是於此了... :)

(順道一提: `eval` )

講到 command line 的重組特性, 真的需要我們好好的加以理解的.
如此便能抽絲剝襺的一層層的將整個 command line 分析得一清二楚, 而不至於含糊.
假如這個重組特性理解下來, 那麼, 接下來我們介紹一個好玩的命令 --- `eval` .

我們在不少變量替換的過程中, 常碰到所謂的複式變量的問題, 如:
 
    a=1
    A1=abc

我們都知道 `echo $A1` 就可得到 `abc` 這個結果.
然而, 我們能否用 `$A$a` 來取代 `$A1` 而同樣替換出 `abc` 呢?

這個問題我們可用很輕鬆的用 `eval`  來解決:

    eval echo \$A$a

說穿了, `eval` 只不過是在命令行完成替換重組後, 再來一次替換重組罷了...
就是這麼簡單啦~~~   ^_^