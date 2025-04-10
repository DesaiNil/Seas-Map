#include<bits/stdc++.h>
using namespace std;

class Graph{

    private:
    unordered_map<string,vector<pair<string, long long>>> adjList;

    public:

    // Undirected graph
    void addEdge(string u, string v, long long weight) {
        adjList[u].push_back({v, weight});
        adjList[v].push_back({u, weight}); 
    }

    // check that location is present or not
    bool hasNode(string node) {
        return adjList.find(node) != adjList.end();
    }

    // finding Shortest Path using 
    void dijkstra(string src,string dest){

        if(!hasNode(src) || !hasNode(dest)){
            cout << "Invalid locations! One or both locations do not exist in the map.\n";
            return;
        }

        // marking all loaction with initial distance as 1e9
        unordered_map<string, long long> dist;
        // storing path 
        unordered_map<string, string>store;
        // intial distance as 1e9;
        for(auto it:adjList){
            dist[it.first]=1e18;
        }

        //priority_queue for travelling
        priority_queue<pair<long long,string>,vector<pair<long long,string>>,
                       greater<pair<long long,string>>>pq;
        
        dist[src]=0;
        pq.push({0,src});

        while(!pq.empty()){
            string Parent=pq.top().second;
            int ParentDist=pq.top().first;
            pq.pop();

            // if(Parent==dest){
            //     cout<<"Location is Reached With distance: "<<dist[dest]<<"\n";

            // }

            // check we have better path than this 
            if(ParentDist>dist[Parent]){
                continue;
            }

            // check its adj node
            for(auto it:adjList[Parent]){
                
                string child=it.first;
                int childDist=it.second;

                if(childDist+ParentDist<=dist[child]){
                    dist[child]=childDist+ParentDist;
                    pq.push({childDist+ParentDist,child});
                    store[child]=Parent;
                }
            }
        }
         // shortest distance is
        // cout<<src<<" "<<"To"<<dest<<" "<<"distance is "<<dist[dest]<<"m\n";
        vector<string> path;

        string current = dest;

        while (current != src) {

            path.push_back(current);
            current = store[current];
        }
        path.push_back(src);

        // Print the shortest distance and path
        cout << "Shortest path distance in meter: " << dist[dest] << endl;
        cout << "Path: ";
        for (int i = path.size() - 1; i >= 0; --i) {
            cout << path[i];
            if (i > 0) cout << " -> ";
        }
        cout<<"\n";
    } 
  
};

// stored map histry
unordered_map<string, Graph> savedMaps;

void createCustomMap() {
    Graph g;
    string mapName;
    
    cout << "Enter map name: ";
    cin.ignore();  // Ignore leftover newline
    getline(cin, mapName);

    long long edges;
    cout << "Enter number of paths: ";
    cin >> edges;
    cin.ignore(); // Ignore newline left by cin

    for (int i = 0; i < edges; ++i) {
        string startLocation, endLocation;
        long long distance;

        cout << "Enter start location: ";
        getline(cin, startLocation);

        cout << "Enter end location: ";
        getline(cin, endLocation);

        cout << "Enter distance in meters: ";
        cin >> distance;
        cin.ignore(); // Ignore newline after reading distance

        g.addEdge(startLocation, endLocation, distance);
    }

    savedMaps[mapName] = g;
    cout << "Map '" << mapName << "' saved successfully!\n";
}


void navigateExistingMap() {
    string mapName;
    
    cout << "Enter map name: ";
    cin.ignore(); // Ignore leftover newline
    getline(cin, mapName); // Read full map name including spaces

    if (savedMaps.find(mapName) == savedMaps.end()) {
        cout << "Map not found! Please create it first.\n";
        return;
    }

    Graph &g = savedMaps[mapName];
    string start, end;

    cout << "Enter start location: ";
    getline(cin, start); // Read full start location including spaces

    cout << "Enter destination: ";
    getline(cin, end); // Read full destination including spaces

    g.dijkstra(start, end);
}

void initializeDefaultMap() {
    Graph wce;
    wce.addEdge("FrontGate","Cyber",100);
    wce.addEdge("Cyber","StudyRoom",100);
    wce.addEdge("Ground","GovermentCanteen",20);
    wce.addEdge("Cyber","CCF",50);
    wce.addEdge("StudyRoom","GirlsHostel",200);
    wce.addEdge("StudyRoom","Libary",100);
    wce.addEdge("StudyRoom","GaneshMandir",50);
    wce.addEdge("Libary","BoysHostel",200);
    wce.addEdge("Libary","Ground",150);
    wce.addEdge("Libary","GaneshMandir",100);
    wce.addEdge("Ground","BoysHostel",200);
    wce.addEdge("Ground","AcademicArea",300);
    wce.addEdge("CCF","GaneshMandir",50);
    wce.addEdge("CCF","CSDept",50);
    wce.addEdge("GaneshMandir","CSDept",70);
    wce.addEdge("GaneshMandir","AcademicArea",50);
    wce.addEdge("CSDept","ELNDept",50);
    wce.addEdge("CSDept","AcademicArea",150);
    wce.addEdge("AcademicArea","ELEDept",50);
    wce.addEdge("ELNDept","ITDept",50);
    wce.addEdge("ELNDept","ELEDept",50);
    wce.addEdge("ITDept","BackGate",700);
    wce.addEdge("ITDept","MECHDept",50);
    wce.addEdge("ELEDept","MECHDept",50);
    wce.addEdge("MECHDept","Civil",50);
    wce.addEdge("MECHDept","CanteenKatta",50);
    wce.addEdge("MECHDept","BackGate",600);
    wce.addEdge("CanteenKatta","BackGate",550);
    wce.addEdge("CivilDept","BackGate",500);
    wce.addEdge("BackGate","GaneshMandir",900);

    savedMaps["wce"] = wce;
    cout << "Default map 'wce' initialized.\n";
}

int main() {

    initializeDefaultMap();
    int choice;
    while (true) {
        cout << "\nChoose an option:\n1. Create your own map\n2. Navigate an existing map\n3. Exit\nEnter choice: ";
        cin >> choice;

        if (choice == 1) {
            createCustomMap();
        } else if (choice == 2) {
            navigateExistingMap();
        } else if (choice == 3) {
             cout<<"EXIT"<<"\n";
            break;
        } else {
            cout << "Invalid choice, try again.\n";
        }
    }
    return 0;
}