##Q12. 你要 `if` 還是 `case` 呢？

放了一個愉快的春節假期，人也變得懶懶散散的... 只是，答應了大家的作業，還是要堅持完成就是了~~~

還記得我們在第 10 章所介紹的 return value 嗎？  
是的，接下來介紹的內容與之有關，若你的記憶也被假期的歡樂時光所抵消掉的話，
那，建議您還是先回去溫習溫習再回來...

若你記得 return value ，我想你也應該記得了 `&&` 與 `||` 是甚麼意思吧？
用這兩個符號再配搭 command group 的話，我們可讓 shell script 變得更加聰明哦。
比方說：

    comd1 && {
        comd2
        comd3
        :
    } || {
        comd4
        comd5
    }

意思是說：  
假如 `comd1` 的 return value 為 `true` 的話，  
然則執行 `comd2` 與 `comd3` ，  
否則執行 `comd4` 與 `comd5` 。


事實上，我們在寫 shell script 的時候，經常需要用到這樣那樣的條件以作出不同的處理動作。
用 `&&` 與 `||` 的確可以達成條件執行的效果，然而，從"人類語言"上來理解，卻不是那麼直觀。
更多時候，我們還是喜歡用 `if .... then ... else ...` 這樣的 keyword 來表達條件執行。
在 bash shell 中，我們可以如此修改上一段代碼：

    if comd1
    then
        comd2
        comd3
    else
        comd4
        comd5
    fi

這也是我們在 shell script 中最常用到的 `if` 判斷式：
只要 `if` 後面的 command line 返回 `true` 的 return value (我們最常用 `test` 命令來送出 return value)，
然則就執行 `then` 後面的命令，否則執行 `else` 後的命令﹔`fi` 則是用來結束判斷式的 keyword 。


在 `if` 判斷式中，`else` 部份可以不用，但 `then` 是必需的。
(若 `then` 後不想跑任何 command ，可用" `：` " 這個 null command 代替)。
當然，`then` 或 `else` 後面，也可以再使用更進一層的條件判斷式，這在 shell script 設計上很常見。
若有多項條件需要"依序"進行判斷的話，那我們則可使用 `elif` 這樣的 keyword ：

    if comd1; then
        comd2
    elif comd3; then
        comd4
    else
        comd5
    fi

意思是說：
若 `comd1` 為 `true` ，然則執行 `comd2` ﹔  
否則再測試 `comd3` ，然則執行 `comd4` ﹔  
倘若 `comd1` 與 `comd3` 均不成立，那就執行 `comd5` 。

`if` 判斷式的例子很常見，你可從很多 shell script 中看得到，我這裡就不再舉例子了...

接下來要為大家介紹的是 `case` 判斷式。
雖然 `if` 判斷式已可應付大部份的條件執行了，然而，在某些場合中，卻不夠靈活，
尤其是在 `string` 式樣的判斷上，比方如下：

    QQ () {
        echo -n "Do you want to continue? (Yes/No): "
        read YN
        if [ "$YN" = Y -o "$YN" = y -o "$YN" = "Yes" -o "$YN" = "yes" -o "$YN" = "YES" ]
        then
            QQ
        else
            exit 0
        fi
    }
    QQ

從例中，我們看得出來，最麻煩的部份是在於判斷 `YN` 的值可能有好幾種式樣。
聰明的你或許會如此修改：

    ...
    if echo "$YN" | grep -q '^[Yy]\([Ee][Ss]\)*$'
    ...

也就是用 Regular Expression 來簡化代碼。(我們有機會再來介紹 RE)
只是... 是否有其它更方便的方法呢？
有的，就是用 `case` 判斷式即可：

    QQ () {
        echo -n "Do you want to continue? (Yes/No): "
        read YN
       case "$YN" in
            [Yy]|[Yy][Ee][Ss])
                QQ
                ;;
            *)
                exit 0
                ;;
        esac
    }
    QQ

我們常用 `case` 的判斷式來判斷某一變量在不同的值(通常是 `string`)時作出不同的處理，
比方說，判斷 script 參數以執行不同的命令。
若你有興趣、且用 Linux 系統的話，不妨挖一挖 `/etc/init.d/*` 裡那堆 script 中的 `case` 用法。
如下就是一例：

    case "$1" in
      start)
            start
            ;;
      stop)
            stop
            ;;
      status)
            rhstatus
            ;;
      restart|reload)
            restart
            ;;
      condrestart)
            [ -f /var/lock/subsys/syslog ] && restart || :
            ;;
      *)
            echo $"Usage: $0 {start|stop|status|restart|condrestart}"
            exit 1
    esac

(若你對 positional parameter 的印像已經模糊了，請重看第 9 章吧。)

okay，十三問還剩一問而已，過幾天再來搞定之....  ^_^