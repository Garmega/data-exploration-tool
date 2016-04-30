NOTE: The API that I had built this on has been unstable for the last few days. As a result
I downloaded data and loaded it in as a JSON file. Unfortunately because of this, there is
only 100 matches to pull this data from and therefore makes the visualization a little
bit bare. Imagine if you will many more points of data, much less outliers and sized accordingly.

I wanted to take simple win-lose data and show general performance patterns with this visual.
Traditionally win-lose statistics are shown as simple bar charts but I didn't think a bunch
of stacked bars was going to answer the question I wanted to know which was what is the overall
performance of this player across all heroes. I believe this visualization answers this question
by giving us blanket visual and quick synopsis on performance. Unfortunately there is a downfall
to this visualization which is the visualization gives the illusion that there is meaning
to the y-axis when in truth it is completely arbitrary and meaningless. This was only done so
the dots were not overlapping. Had I had more time, I would have added alternating area colors and
borders between each 10% increment in order to minimize this misleading visual cue.

'Show Hero Type' toggle
Originally I wanted to include this function into the default chart. However I soon realized
that the color without context could potentially be mistaken for extra information so I move the
function to it's own toggle button to turn on and off. The purpose of this function was to show how
proficient the player is with certain types of heroes. An even distribution of types would be approximately
1/3 per type however many players typically lean away from one type. I wanted to highlight
this factor for the player.

'Show Density' toggle
The point of this toggle was to show/hide the amount of observations per hero were made. I thought this
was important in order to give weight and emphasis to those with higher counts. This gives the viewer a
sense of confidence when looking at any specific point of data because the win-lose percentile is less
likely to be just a fluke if more observations have been made.
