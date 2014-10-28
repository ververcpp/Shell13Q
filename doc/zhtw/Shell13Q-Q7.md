##Q7. `( )` 與 `{ }` 差在哪？

嗯，這次輕鬆一下，不講太多...  ^_^

先說一下，為何要用 `( )` 或 `{ }` 好了。  
許多時候，我們在 shell 操作上，需要在一定條件下一次執行多個命令，  
也就是說，要麼不執行，要麼就全執行，而不是每次依序的判斷是否要執行下一個命令。  
或是，需要從一些命令執行優先次順中得到豁免，如算術的 `2*(3+4)` 那樣...  
這時候，我們就可引入"命令群組"(command group)的概念：將多個命令集中處理。  

在 shell command line 中，一般人或許不太計較 `( )` 與 `{ }` 這兩對符號的差異，  
雖然兩者都可將多個命令作群組化處理，但若從技術細節上，卻是很不一樣的： 

* `( )` 將 command group 置於 sub-shell 去執行，也稱 nested sub-shell。  
* `{ }` 則是在同一個 shell 內完成，也稱為 non-named command group。  

若，你對上一章的 `fork` 與 `source` 的概念還記得了的話，那就不難理解兩者的差異了。  
要是在 command group 中扯上變量及其他環境的修改，我們可以根據不同的需求來使用 `( )` 或 `{ }` 。  
通常而言，若所作的修改是臨時的，且不想影響原有或以後的設定，那我們就 nested sub-shell ，  
反之，則用 non-named command group 。  

是的，光從 command line 來看，`( )` 與 `{ }` 的差別就講完了，夠輕鬆吧~~~  ^_^  
然而，若這兩個 `meta` 用在其他 command meta 或領域中(如 Regular Expression)，還是有很多差別的。  
只是，我不打算再去說明了，留給讀者自己慢慢發掘好了...  
我這裡只想補充一個概念，就是 `function` 。
所謂的 `function` ，就是用一個名字去命名一個 command group ，然後再調用這個名字去執行 command group 。
從 non-named command group 來推斷，大概你也可以猜到我要說的是 `{ }` 了吧？(yes! 你真聰明﹗  ^_^ )

在 bash 中，`function` 的定義方式有兩種：

方式一：

    function function_name {
      command1
      command2
      command3
      ....
    }

方式二：

    fuction_name () {
        command1
        command2
        command3
        ....
    }

用哪一種方式無所謂，只是若碰到所定意的名稱與現有的命令或別名(Alias)衝突的話，方式二或許會失敗。  
但方式二起碼可以少打 `function` 這一串英文字母，對懶人來說(如我)，又何樂不為呢？...  ^_^

`function` 在某一程度來說，也可稱為"函式"，但請不要與傳統編程所使用的函式(`library`)搞混了，畢竟兩者差異很大。
惟一相同的是，我們都可以隨時用"已定義的名稱"來調用它們...
若我們在 shell 操作中，需要不斷的重覆執行某些命令，我們首先想到的，或許是將命令寫成命令稿(shell script)。
不過，我們也可以寫成 `function` ，然後在 command line 中打上 function_name 就可當一舨的 script 來使用了。
只是若你在 shell 中定義的 `function` ，除了可用 `unset function_name` 取消外，一旦退出 shell ，`function` 也跟著取消。 
然而，在 script 中使用 `function` 卻有許多好處，除了可以提高整體 script 的執行效能外(因為已被載入)，
還可以節省許多重覆的代碼...

簡單而言，若你會將多個命令寫成 script 以供調用的話，那，你可以將 `function` 看成是 script 中的 script ...  ^_^
而且，透過上一章介紹的 `source` 命令，我們可以自行定義許許多多好用的 `function` ，再集中寫在特定文件中，
然後，在其他的 script 中用 `source` 將它們載入並反覆執行。
若你是 RedHat Linux 的使用者，或許，已經猜得出 `/etc/rc.d/init.d/functions` 這個文件是作啥用的了~~~  ^_^  

okay，說要輕鬆點的嘛，那這次就暫時寫到這吧。祝大家學習愉快﹗  ^_^