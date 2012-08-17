ArrayList nodes;
int numNodes = 0;
int r = 255, g = 0, b = 0;
int increment = 1;
float freqR = .005, freqG = .005, freqB = .005;
int phaseR = 0, phaseG = 2, phaseB = 4;
int radius = 50; 
bool black = false;

void makeRainbow() {
	
	if(increment>100000) increment = 0;
	r = sin(freqR * increment + phaseR) * 127 + 128;		
	g = sin(freqG * increment + phaseG) * 127 + 128;	
	b = sin(freqB * increment + phaseB) * 127 + 128;
	increment++;
	fill(r,g,b);	
}

interface JavaScript {
	void clearCanvas();
}

void bindJavascript(JavaScript js) {
	javascript = js;
}

JavaScript javascript;

void setup() {
	size(1400,775);
	background(30);
	frameRate(480);
    smooth();
	noStroke();

	/*int r = (int)random(0, 255);
	int g = (int)random(0, 255);
	int b = (int)random(0, 255);*/
	fill(r,g,b);

	  
    nodes = new ArrayList();
	/*
	Node test = null;
	test = new Node(numNodes++);
	nodes.add(test);

	test.setLocation(450,400);
	test.render();
	noStroke();
	fill(255,0,0);*/

}

void draw() {
	//background(30);
	Iterator itr = nodes.iterator();
	while(itr.hasNext()) {
		Node n = (Node)itr.next();
		n.render();
	}
}

void clearScreen() {
	background(30);
}

void smallCircle() {
	radius = 50;
}

void bigCircle() {
	radius = 100;
}

void setSize(int size) {
	radius = size;
}

void blackCircle() {
	black = true;
}

void colorCircle() {
	black = false;
}

void touchStart(TouchList touches, Touch newTouch, int newTouchID) {
/*
	boolean emptySpace = true;
	Iterator itr = nodes.iterator();
	while(itr.hasNext()) {
		Node n = (Node)itr.next();
		if(n.isect(newTouch.X,newTouch.Y)) {
			n.setSelected(true);
			n.setTouchID(newTouchID);
			emptySpace = false;
		} else {
			n.setSelected(false);
		}
	}

	if(emptySpace) {
		Node newNode = new Node(numNodes++);
		newNode.setLocation(newTouch.X,newTouch.Y);
		nodes.add(newNode);
	}*/
}

void touchMove(TouchList touches, Touch newTouch, int newTouchID) {

	/*Iterator touchesItr = touches.iterator();
	while(touchesItr.hasNext()) {
		
		Touch t = (Touch)touchesItr.next(); 

		Iterator nodeItr = nodes.iterator();	
		while(nodeItr.hasNext()) {
			Node n = (Node)nodeItr.next();
			if(n.getSelected()) {
				n.setLocation(t.X,t.Y);
			}
		}
	}*/
	
	if (black) fill(30); else makeRainbow();
	ellipse(newTouch.X,newTouch.Y,radius,radius);
}