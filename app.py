from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL

app = Flask(__name__)  #create the app
app.config['MYSQL_HOST'] = 'localhost'  #set the host
app.config['MYSQL_USER'] = 'root'  #set the database user
app.config['MYSQL_PASSWORD'] = ''  #set the database password
app.config['MYSQL_DB'] = 'flask_bd' #set the name of the database
mysql = MySQL(app)

app.secret_key = 'mysecretkey' # settings

contacts = []; #create a global list to the contacts of the DB
ban = 0; #create a flag that we going to use for indicate the div in the html file, for example if ban = 3 belongs to the "add" part

@app.route('/')
def Index(): #This function will be execute when we are in the home part of our page
    global contacts, ban  #we point the global variables in this function
    ban = 0  #zero will be for the contact inquiry part
    cur = mysql.connection.cursor()  #stablish a connection to the DB
    cur.execute('SELECT * FROM contacts') #execute a data query
    data = cur.fetchall() #get the result
    #return all the contacts and send them to the page
    return render_template('index.html', contacts = data, ban = ban) #it is not necessary to put the folder "templates" because flask already has configured that name

@app.route("/add_contact", methods=['POST']) #this is the part where we going to get the contacts added from the html
def add_contact():
    if request.method == 'POST':
        global ban
        ban = 3 #three will be for the add contacts part
        fullname = request.form['fullname']   #Here we get the name, phone and email from the html
        phone = request.form['phone']
        email = request.form['email']
        print(fullname + " "+phone+" "+email)
        cur = mysql.connection.cursor() #insert the 3 data(row) to the DB (the id isnt here because the DB is configured with id autoincrement)
        cur.execute('INSERT INTO contacts (name, phone, email) VALUES (%s, %s, %s)', (fullname, phone, email))
        mysql.connection.commit() #commit the insert query
        return redirect(url_for('consulta')) #redirect to the 'consulta' function

@app.route('/modify', methods=['POST'])
def modify(): #this is the part where we going to get the contacts that we will modify
    if request.method == 'POST':
        global ban
        ban = 2 #two will be for the modify contacts part
        id = request.form['id']
        tipo = request.form['tipo']
        phone = request.form['phone']
        email = request.form['email']

        print(tipo+" "+id+" "+phone+" "+email)
        if tipo == 'tel':  #this condition is depending what we choose to modify in the html file, either phone or email
            cur = mysql.connection.cursor()
            cur.execute('UPDATE contacts SET phone = %s WHERE id = %s', (phone, id)) #execute the update query
            mysql.connection.commit()
        elif tipo == 'mail':
            cur = mysql.connection.cursor()
            cur.execute('UPDATE contacts SET email = %s WHERE id = %s', (email, id))
            mysql.connection.commit()

        return redirect(url_for('consulta'))

@app.route('/delete/<string:id>')
def delete(id):   #this is the part where we going to get the contacts that we will delete
    global ban
    print(id)
    cur = mysql.connection.cursor()
    cur.execute('DELETE FROM contacts WHERE id = '+id) #execute the delete query
    mysql.connection.commit()
    ban = 1 #one will be for the delete contacts part
    return redirect(url_for('consulta'))

@app.route('/consulta')
def consulta(): #this is the part where we going to send all the contacts to the html
    global contacts
    global ban #this is very important because depends on this is where the delete, add, or modify part will be redirected
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM contacts')
    data = cur.fetchall()
    contacts = data
    print(contacts)
    return render_template('index.html', contacts = data, ban = ban)
    #return ('index.html', 204)


if __name__ == '__main__':
    app.run(port = 3000, debug = True)
