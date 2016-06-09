Strava Club Visualizer: Club Heatmap and Segment Explorer
===============

## Team Members

Collin Walker (cwalker2), Yitao Wang (yitaow), Si Xie (rickixie), Li Zeng (lizeng)


## Project
![Thumbnail](thumbnail.png)

Recent years have seen the increasing popularity of fitness tracking applications, among which Strava plays a leading role in facilitating online communities by individual connections and activity-based clubs. Given the limited visualizations Strava currently offers regarding club activities, we propose Strava Club Visualizer, an exploratory visualization for Strava users, allowing cyclists to find prospective clubs, explore new routes and meet new partners. To better understand the problem space we adopted a user-centered design process where we interviewed Strava end-users to gather our design specifications. Our implementation reduces the visual cluster and allows users to query dynamically with spatial and temporal dimensions. In addition, our visualization yielded positive feedback regarding system’s usability, visual appearance, and the capability to facilitate interpersonal relationships.

[Project Page] (http://cse512-16s.github.io/fp-rickixie-taoaoao-collnwalkr-lilizeng99/) | 
[Visualization] (http://cse512-16s.github.io/fp-rickixie-taoaoao-collnwalkr-lilizeng99/development) | 
[Poster](https://github.com/CSE512-16S/fp-jheer-mcorrell-jhoffs/raw/master/final/poster-jheer-mcorrell-jhoffs.pdf) | 
[Final Paper](https://github.com/CSE512-16S/fp-jheer-mcorrell-jhoffs/raw/master/final/paper-jheer-mcorrell-jhoffs.pdf)

## Acknowledgement
We want to thank Scott Miller and Andrew Pryhuber for providing design insights and suggestions for the visualization. Thanks to our instructors Jeffrey Heer, Michael Correll and Jane Hoffswell for providing instructions and reviews for our design.

## Running Instructions
Access our visualization at http://cse512-16s.github.io/fp-rickixie-taoaoao-collnwalkr-lilizeng99/development/ or download this repository and run `python -m SimpleHTTPServer 9000` and access this from http://localhost:9000/.

## Research and Development Process
The project was initially proposed by Li as part of her research interest in social network analysis of a online fitness network Strava.  After consulting with Jeff, we decided to pivot our project focus in designing a exploratory visualization tool for Strava users, in particular for users who have an interest in joining or is a member of a Strava club. After two ideation sessions and exploration with the Strava API, we identified several tentative features and tasks for our design and storyboarded the visualization. 

While Li and Collin were working on collecting the data and implementing the visualization platform, Ricki and Yitao were exploring Strava and recruiting cycling members around the Seattle area to understand their cycling behaviors and needs. Through the user research with two members of the Husky Cycling Club, we were able to scope down our design in providing visualization that help them find prospective club to join, and discover new routes and find cycling partners within their social circle.

Because our data contains both spatial and temporal attributes, we finalized our mapping platform using Mapbox (https://www.mapbox.com/mapbox-gl-js/api/) and drawing the timeline histogram with d3.js (https://d3js.org/). We used the crossfilter library (http://square.github.io/crossfilter/) to support selecting and filtering of our multivariates data based on selected time span. We perform spatial aggregation by binning activity coordinate data into Hexagonal Grids, specially using Jenks natural break optimization, to classify each Hexagonal Grid cell along a spectrum of activity.

To assist the implementation, the team created another sets of low-fidelity mockups based on the user research findings, and Ricki converted it into a high-fidelity prototype adapting Strava’s branding guidelines. 

For the implementation, Collin was focusing on creating the layout and visualizing activity data through hexagonal heatmap and plotting the segment coordinates through mapbox while Li was focusing on creating the timeline control histogram and data filter and constructing the table and pop-up panel visualizations for segment details in response to the current map view. Ricki also customized the mapbox tile to show contour lines to address cyclists’ needs in riding on different road conditions.

At the meantime, Yitao and Ricki worked on refining research results (literature review, user research) and writing up the paper. Yitao created the poster for the open house as well as drafting the github project page. 

## Breakdown of Work
Collin Walker: Development --- mapbox master

Yitao Wang: User Research, Design --- poster ninja

Rick Si Xie: User Research, Design --- paper killer

Li Zeng: Data Collection and Data Wrangling, Development --- data queen

