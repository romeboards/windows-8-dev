class Node {
	int id;
	int posX = 0, posY = 0;
	float radius = 75.0;
	int r, g, b;
	int touchID;

	public Node(int _id) {
		id = _id;
		/*
		int r = (int)random(0, 255);
		int g = (int)random(0, 255);
		int b = (int)random(0, 255);

		setColor(r,g,b);*/
	}

	int getID() {
		return id;
	}

	void setTouchID(int _touchID) {
		touchID = _touchID;
	}

	int getTouchID() {
		return touchID;
	}

	void setColor(int _r, int _g, int _b) {
		r= _r; g = _g; b= _b;
	}

	public boolean getSelected() {
		return selected;
	}

	public void setSelected(boolean _selected) {
		selected = _selected;
	}

	public boolean isect(int mouseX, int mouseY) {
		float distance = sqrt((mouseX - posX) * (mouseX - posX) + (mouseY - posY) * (mouseY - posY));
		if(distance < radius) {
			return true;
		}
		return false;
	}

	public void setLocation(int _posx, int _posy) {
		/*if(_posx < 10) posx = 15;
		else if(_posx > width - 15) posx = width - 15;
		else*/ 
		posX = _posx;

		/*if(_posy < 10) posy = 15;
		else if(_posy > width - 15) posy = width - 15;
		else*/ 
		posY = _posy;
	}

	public void explodeCircle() {
		
		if(radius >= 50.0) {
			ellipse(posX,posY,radius*2,radius*2);			
		}
		else {
			radius+=.001;
			ellipse(posX,posY,radius*2,radius*2);
			explodeCircle();
		}
	}

	public void render() {
		
		ellipse(posX,posY,radius*2,radius*2);
	}

	public void renderSelected() {
		strokeWeight(5);
		stroke(r,g,b);
		fill(r,g,b);

		ellipse(posX,posY,radius*2,radius*2);
	}

	/*TODO
	 touch move/drag 
	 touch resize*/

}