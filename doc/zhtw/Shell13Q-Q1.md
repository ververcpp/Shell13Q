##Q1. 為何叫做 shell ？

在介紹 shell 是甚麼東西之前，不妨讓我們重新檢視使用者與電腦系統的關係：  
> 圖(FIXME)

我們知道電腦的運作不能離開硬體，但使用者卻無法直接對硬體作驅動，
硬體的驅動只能透過一個稱為"作業系統(Operating System)"的軟體來控管，
事實上，我們每天所談的 linux ，嚴格來說只是一個作業系統，我們稱之為"核心(kernel)"。  

然而，從使用者的角度來說，使用者也沒辦法直接操作 kernel，
而是透過 kernel 的"外殼"程式，也就是所謂的 shell ，來與 kernel 溝通。
這也正是 kernel 跟 shell 的形像命名關係。如圖：  
> 圖(FIXME)

從技術角度來說，shell 是一個使用者與系統的互動界面(interface)，
主要是讓使用者透過命令行(command line)來使用系統以完成工作。
因此，shell 的最簡單的定義就是---命令解譯器(Command Interpreter)：

+ **將使用者的命令翻譯給核心處理，**  
+ **同時，將核心處理結果翻譯給使用者。**  
  
每次當我們完成系統登入(log in)，我們就取得一個互動模式的 shell ，也稱為 login shell 或 primary shell。
若從行程(process)角度來說，我們在 shell 所下達的命令，均是 shell 所產生的子行程。這現像，我們暫可稱之為 fork。 
如果是執行腳本(shell script)的話，腳本中的命令則是由另外一個非互動模式的子 shell (sub shell)來執行的。
也就是 primary shell 產生 sub shell 的行程，sub shell 再產生 script 中所有命令的行程。
(關於行程，我們日後有機會再補充。)  
  
這裡，我們必須知道：kernel 與 shell 是不同的兩套軟體，而且都是可以被替換的：

+ 不同的作業系統使用不同的 kernel，  
+ 而在同一個 kernel 之上，也可使用不同的 shell。  

在 linux 的預設系統中，通常都可以找到好幾種不同的 shell ，且通常會被列於如下檔案裡：
    
    /etc/shells

不同的 shell 有著不同的功能，且也彼此各異、或說"大同小異"。
常見的 shell 主要分為兩大主流：  

+ sh：
    - burne shell (sh)
    - burne again shell (bash)
+ csh：
    - c shell (csh)
    - tc shell (tcsh)
    - korn shell (ksh)

大部份的 Linux 系統的預設 shell 都是 bash ，其原因大致如下兩點：

+ **自由軟體**  
+ **功能強大**  

bash 是 gnu project 最成功的產品之一，自推出以來深受廣大 Unix 用戶喜愛，
且也逐漸成為不少組織的系統標準。