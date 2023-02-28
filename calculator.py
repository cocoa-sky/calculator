import tkinter

FONT = ("Times New Roman",23)
FONT2 = ("Times New Roman",15)
color = ["#2d2b3b","#b1fbc4"]
number = 0
idx = 0
tmr = 0
calculation = []
maths_symbols = []
equal = 0
float = 0
sign = 0

def push_btn00():
    global number,equal,float,sign
    sign = 0
    float = 0
    if equal == 1:
        number = 0
        equal = 0
    if len(str(number)) == 0:
        number = 0
    elif len(str(number)) >= 1 and len(str(number)) <= 8:
        number = number*100

def push_btn_point():
    global float,sign
    sign = 0
    float = 1

def push_btn_equal():
    global calculation,maths_symbols,number,equal,float,sign
    sign = 0
    float = 0
    calculation.append(number)
    if len(calculation) == 1:
        pass
    elif len(calculation) >= 2:
        tmp = calculation[0]
        for i in range(len(maths_symbols)):
            if maths_symbols[i] == 1:
                tmp = tmp + calculation[i+1]
            elif maths_symbols[i] == 2:
                tmp = tmp - calculation[i+1]
            elif maths_symbols[i] == 3:
                tmp = tmp * calculation[i+1]
            elif maths_symbols[i] == 4:
                if tmp%calculation[i+1] == 0:
                    tmp = int(tmp / calculation[i+1])
                else:
                    tmp = tmp / calculation[i+1]
        if tmp > 9999999999:
            tmp = 9999999999
        if len(str(tmp)) - len(str(int(tmp))) >= 1:
            tmp = round(tmp,2)
        while len(str(tmp)) - len(str(int(tmp))) >= 1 and int(str(tmp)[len(str(tmp))-1]) == 0:
            if len(str(tmp)) - len(str(int(tmp))) == 3:
                tmp = round(tmp,1)
            elif len(str(tmp)) - len(str(int(tmp))) == 2:
                tmp = int(tmp)
        if len(str(tmp)) == 13:
            tmp = int(tmp)
        if len(str(tmp)) == 12:
            tmp = round(tmp,1)
        number = tmp
    calculation.clear()
    maths_symbols.clear()
    equal = 1

def push_btn_plus():
    global calculation,number,equal,float,sign
    float = 0
    equal = 0
    if sign == 1:
        maths_symbols[len(maths_symbols)-1] = 1
    else:
        calculation.append(number)
        maths_symbols.append(1)
        number = 0
    sign = 1

def push_btn_ac():
    global number,equal,float,sign
    sign = 0
    float = 0
    equal = 0
    number = 0
    calculation.clear()
    maths_symbols.clear()

def push_btn_number(push_number):
    global number,equal,float,sign
    sign = 0
    if float == 1 and len(str(number)) <= 9:
        if len(str(number)) - len(str(int(number))) == 3:
            pass
        elif push_number >= 1 and push_number <= 9:
            if len(str(number)) - len(str(int(number))) == 2:
                number = number + 0.01*push_number
                number = round(number,2)
            elif len(str(number)) - len(str(int(number))) == 0:
                number = number + 0.1*push_number
                number = round(number,1)
        elif push_number == 0 and len(str(number)) <= 8:
            if len(str(number)) - len(str(int(number))) == 0:
                number = number * 1.0
                number = round(number,1)
    elif float == 0:
        if equal == 1:
            number = 0
            equal = 0
        if len(str(number)) == 0:
            number = push_number
        elif len(str(number)) >= 1 and len(str(number)) <= 9:
            number = number*10+push_number

def push_btn_minus():
    global calculation,maths_symbols,number,equal,float,sign
    float = 0
    equal = 0
    if sign == 1:
        maths_symbols[len(maths_symbols)-1] = 2
    else:
        calculation.append(number)
        maths_symbols.append(2)
        number = 0
    sign = 1

def push_btn_c():
    global number,equal
    equal = 0
    if len(str(number)) - len(str(int(number))) == 3:
        number = round(number,1)
    elif len(str(number)) - len(str(int(number))) == 2:
        number = int(number)
    else:
        if len(str(number)) == 0 or len(str(number)) == 1:
            number = 0
        elif len(str(number)) >= 2:
            number = (number-int(str(abs(number))[-1]))/10
            number = int(number)

def push_btn_times():
    global calculation,number,equal,float,sign
    float = 0
    equal = 0
    if sign == 1:
        maths_symbols[len(maths_symbols)-1] = 3
    else:
        calculation.append(number)
        maths_symbols.append(3)
        number = 0
    sign = 1

def push_btn_divided():
    global calculation,maths_symbols,number,equal,float,sign
    float = 0
    equal = 0
    if sign == 1:
        maths_symbols[len(maths_symbols)-1] = 4
    else:
        calculation.append(number)
        maths_symbols.append(4)
        number = 0
    sign = 1

def draw_calculator(canvas):
    canvas.delete("NUMBERS")
    canvas.create_text(245,27,text='{:,}'.format(number),fill=color[0],anchor="ne",font=FONT,tag="NUMBERS")

def main():
    global idx,number,calculation,maths_symbols,equal,float,sign

    if idx == 0:
        calculation = []
        maths_symbols = []
        equal = 0
        number = 0
        float = 0
        sign = 0
        idx = 1
    elif idx == 1:
        draw_calculator(canvas)

    root.after(100,main)

root = tkinter.Tk()
root.title("calculator")
root.resizable(False,False)
canvas = tkinter.Canvas(width=275,height=295,bg=color[1])
canvas.pack()

img_number = []
for a in range(10):
    img_number.append(tkinter.PhotoImage(file=str(a)+".png"))
img_btn = [
tkinter.PhotoImage(file="00.png"), #0
tkinter.PhotoImage(file="plus.png"),
tkinter.PhotoImage(file="minus.png"),
tkinter.PhotoImage(file="times.png"),
tkinter.PhotoImage(file="divided.png"),
tkinter.PhotoImage(file="equal.png"),
tkinter.PhotoImage(file="point.png"),
tkinter.PhotoImage(file="c.png"),
tkinter.PhotoImage(file="ac.png") #8
]
img_square = tkinter.PhotoImage(file="square.png")

canvas.create_image(142,45,image=img_square)
calculator_btn0 = tkinter.Button(bg=color[1],image=img_number[0],relief="flat",bd=0,command=lambda:push_btn_number(0))
calculator_btn0.place(x=20,y=240) #0
calculator_btn00 = tkinter.Button(bg=color[1],image=img_btn[0],relief="flat",bd=0,command=push_btn00)
calculator_btn00.place(x=70,y=240) #00
calculator_btn_point = tkinter.Button(bg=color[1],image=img_btn[6],relief="flat",bd=0,command=push_btn_point)
calculator_btn_point.place(x=120,y=240) #.
calculator_btn_equal = tkinter.Button(bg=color[1],image=img_btn[5],relief="flat",bd=0,command=push_btn_equal)
calculator_btn_equal.place(x=170,y=240) #=
calculator_btn_plus = tkinter.Button(bg=color[1],image=img_btn[1],relief="flat",bd=0,command=push_btn_plus)
calculator_btn_plus.place(x=220,y=240) #+
calculator_btn_ac = tkinter.Button(bg=color[1],image=img_btn[8],relief="flat",bd=0,command=push_btn_ac)
calculator_btn_ac.place(x=20,y=190) #ac
calculator_btn1 = tkinter.Button(bg=color[1],image=img_number[1],relief="flat",bd=0,command=lambda:push_btn_number(1))
calculator_btn1.place(x=70,y=190) #1
calculator_btn2 = tkinter.Button(bg=color[1],image=img_number[2],relief="flat",bd=0,command=lambda:push_btn_number(2))
calculator_btn2.place(x=120,y=190) #2
calculator_btn3 = tkinter.Button(bg=color[1],image=img_number[3],relief="flat",bd=0,command=lambda:push_btn_number(3))
calculator_btn3.place(x=170,y=190) #3
calculator_btn_minus = tkinter.Button(bg=color[1],image=img_btn[2],relief="flat",bd=0,command=push_btn_minus)
calculator_btn_minus.place(x=220,y=190) #-
calculator_btn_c = tkinter.Button(bg=color[1],image=img_btn[7],relief="flat",bd=0,command=push_btn_c)
calculator_btn_c.place(x=20,y=140) #c
calculator_btn4 = tkinter.Button(bg=color[1],image=img_number[4],relief="flat",bd=0,command=lambda:push_btn_number(4))
calculator_btn4.place(x=70,y=140) #4
calculator_btn5 = tkinter.Button(bg=color[1],image=img_number[5],relief="flat",bd=0,command=lambda:push_btn_number(5))
calculator_btn5.place(x=120,y=140) #5
calculator_btn6 = tkinter.Button(bg=color[1],image=img_number[6],relief="flat",bd=0,command=lambda:push_btn_number(6))
calculator_btn6.place(x=170,y=140) #6
calculator_btn_times = tkinter.Button(bg=color[1],image=img_btn[3],relief="flat",bd=0,command=push_btn_times)
calculator_btn_times.place(x=220,y=140) #*
calculator_btn7 = tkinter.Button(bg=color[1],image=img_number[7],relief="flat",bd=0,command=lambda:push_btn_number(7))
calculator_btn7.place(x=70,y=90) #7
calculator_btn8 = tkinter.Button(bg=color[1],image=img_number[8],relief="flat",bd=0,command=lambda:push_btn_number(8))
calculator_btn8.place(x=120,y=90) #8
calculator_btn9 = tkinter.Button(bg=color[1],image=img_number[9],relief="flat",bd=0,command=lambda:push_btn_number(9))
calculator_btn9.place(x=170,y=90) #9
calculator_btn_divided = tkinter.Button(bg=color[1],image=img_btn[4],relief="flat",bd=0,command=push_btn_divided)
calculator_btn_divided.place(x=220,y=90) #/
main()
root.mainloop()